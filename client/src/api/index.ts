import { tokenRefresh } from "@/api/auth";
import { logOnDev } from "@/utils/logging";
import { getToken, setToken } from "@/utils/token";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const instance = axios.create({
  baseURL: "https://boomap.site/api",
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 리프레시 재시도 플래그 확장
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// 요청 인터셉터
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { method, url } = config;
  logOnDev(`🚀 [API Request] ${method?.toUpperCase()} ${url}`);
  const accessToken = getToken();

  config.headers["Content-Type"] = "application/json";
  config.headers["Authorization"] = `Bearer ${accessToken}`;

  return config;
});

// 응답 인터셉터
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { method, url } = response.config;
    const { status } = response;

    logOnDev(`🚀 [API Response] ${method?.toUpperCase()} ${url} | Response ${status}`);

    return response;
  },
  async (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      const originalRequest = error.config;
      logOnDev(`🚨 [API ERROR] ${error.message}`);

      if (!error.response) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newAccessToken = await tokenRefresh();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      }

      return Promise.reject(error);
    }
    logOnDev(`🚨 [API ERROR] ${error.message}`);
  },
);

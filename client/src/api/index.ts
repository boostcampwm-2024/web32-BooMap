import { tokenRefresh } from "@/api/auth";
import { logOnDev } from "@/utils/logging";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useConnectionStore } from "@/store/useConnectionStore";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_SERVER_BASE_URL,
  timeout: 3000,
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
  const { method, baseURL, url } = config;
  logOnDev(`🚀 [API Request] ${method?.toUpperCase()} ${baseURL} ${url}`);
  const accessToken = useConnectionStore.getState().token;

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

      if (error.response.status === 401) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          const newAccessToken = await tokenRefresh();
          useConnectionStore.getState().tokenRefresh(newAccessToken.accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken.accessToken}`;

          return instance(originalRequest);
        }
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
    logOnDev(`🚨 [API ERROR] ${error.message}`);
  },
);

import { instance } from "@/api";
import { useConnectionStore } from "@/store/useConnectionStore";
import { TokenRefresh, User } from "@/types/auth";
import { logOnDev } from "@/utils/logging";
import axios, { AxiosError, AxiosResponse } from "axios";

export const instanceForAuth = axios.create({
  baseURL: import.meta.env.VITE_APP_API_SERVER_BASE_URL,
  timeout: 3000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instanceForAuth.interceptors.response.use(
  (response: AxiosResponse) => {
    const { method, url } = response.config;
    const { status } = response;

    logOnDev(`🚀 [API Response] ${method?.toUpperCase()} ${url} | Response ${status}`);

    return response;
  },
  async (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      logOnDev(`🚨 [API ERROR] ${error.message}`);

      if (!error.response) {
        return Promise.reject(error);
      }

      try {
        await signOut();
      } catch (error) {
        logOnDev(`🚨 [API ERROR] ${error.message}`);
      } finally {
        useConnectionStore.getState().logout();
        location.href = "/";
      }

      return Promise.reject(error);
    }
    logOnDev(`🚨 [API ERROR] ${error.message}`);
  },
);

export const tokenRefresh = async (): Promise<TokenRefresh> => {
  const { data } = await instanceForAuth.post("/auth/refresh", {}, { withCredentials: true });
  return data;
};

export const getUser = async (): Promise<User> => {
  const { data } = await instance.get("/user/info");
  return data;
};

export const signOut = async () => {
  return instanceForAuth.post("/auth/logout");
};

import { useConnectionStore } from "@/store/useConnectionStore";
import { logOnDev } from "@/utils/logging";
import axios from "axios";
import { InternalAxiosRequestConfig } from "axios";

export const instanceForAi = axios.create({
  baseURL: import.meta.env.VITE_APP_API_SERVER_BASE_URL,
  timeout: 3000,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

instanceForAi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { method, baseURL, url } = config;
  logOnDev(`🚀 [API Request] ${method?.toUpperCase()} ${baseURL} ${url}`);
  const accessToken = useConnectionStore.getState().token;

  config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

export function AudioAiConvert(formData: FormData) {
  return instanceForAi.post(`/ai/audio`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

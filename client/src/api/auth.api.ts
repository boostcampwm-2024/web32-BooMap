import { instance } from "@/api";
import { TokenRefresh, User } from "@/types/auth";
import axios from "axios";

export const instanceForRefresh = axios.create({
  baseURL: import.meta.env.VITE_APP_API_SERVER_BASE_URL,
  timeout: 3000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const tokenRefresh = async (): Promise<TokenRefresh> => {
  const { data } = await instanceForRefresh.post("/auth/refresh", {}, { withCredentials: true });
  return data;
};

export const getUser = async (): Promise<User> => {
  const { data } = await instance.get("/user/info");
  return data;
};

export const signOut = async () => {
  return instance.post("/auth/logout");
};

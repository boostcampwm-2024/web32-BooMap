import { instance } from "@/api";
import { TokenRefresh } from "@/types/auth";

export const tokenRefresh = async (): Promise<TokenRefresh> => {
  const { data } = await instance.post("/api/auth/refresh", {}, { withCredentials: true });
  return data;
};

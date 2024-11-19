import { instance } from "@/api";
import { TokenRefresh, User } from "@/types/auth";

export const tokenRefresh = async (): Promise<TokenRefresh> => {
  const { data } = await instance.post("/api/auth/refresh");
  return data;
};

export const getUser = async (): Promise<User> => {
  const { data } = await instance.get("/api/user/info");
  return data;
};

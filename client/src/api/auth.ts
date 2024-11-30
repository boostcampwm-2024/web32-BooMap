import { instance } from "@/api";
import { TokenRefresh, User } from "@/types/auth";

export const tokenRefresh = async (): Promise<TokenRefresh> => {
  const { data } = await instance.post("/auth/refresh", {}, { withCredentials: true });
  return data;
};

export const getUser = async (): Promise<User> => {
  const { data } = await instance.get("/user/info");
  return data;
};

import { instance } from "@/api";
import { TokenRefresh, User } from "@/types/auth";
import { setToken } from "@/utils/localstorage";

export const tokenRefresh = async (): Promise<TokenRefresh> => {
  const { data } = await instance.post("/auth/refresh", {}, { withCredentials: true });
  setToken(data.accessToken);
  return;
};

export const getUser = async (): Promise<User> => {
  const { data } = await instance.get("/user/info");
  return data;
};

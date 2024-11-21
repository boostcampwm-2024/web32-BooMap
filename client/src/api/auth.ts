import { instance } from "@/api";
import { TokenRefresh, User } from "@/types/auth";
import { setToken } from "@/utils/token";

export const tokenRefresh = async (): Promise<TokenRefresh> => {
  const { data } = await instance.post("auth/refresh", {}, { withCredentials: true });
  setToken(data.accessToken);
  return;
};

// export const getUser = async (): Promise<User> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ email: "qwrqwrqwr@naver.com", nickname: "민형" });
//     }, 2000);
//   });
// };

export const getUser = async (): Promise<User> => {
  const { data } = await instance.get("user/info");
  return data;
};

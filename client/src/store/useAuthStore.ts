import { getToken, removeToken } from "@/utils/token";
import { create } from "zustand";

type UserStore = {
  email: null | string;
  nickname: null | string;
  isAuthenticated: boolean;
  checkAuthenticated: () => void;
  logout: () => void;
  setUser: (email: string, nickname: string) => void;
};
export const useAuthStore = create<UserStore>((set) => ({
  email: null,
  nickname: null,
  isAuthenticated: false,

  checkAuthenticated: () => {
    const accessToken = getToken();
    if (accessToken) {
      set({ isAuthenticated: true });
    }
  },

  logout: () => {
    removeToken();
    set({ email: null, isAuthenticated: false });
  },

  setUser: (email: string, nickname: string) => {
    set({ email: email, nickname: nickname, isAuthenticated: true });
  },
}));

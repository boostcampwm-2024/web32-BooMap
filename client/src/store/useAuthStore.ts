import { getToken, removeToken } from "@/utils/localstorage";
import { create } from "zustand";

type UserStore = {
  email: null | string;
  name: null | string;
  id: null | number;
  isAuthenticated: boolean;
  checkAuthenticated: () => void;
  logout: () => void;
  setUser: (email: string, name: string, id: number) => void;
};
export const useAuthStore = create<UserStore>((set) => ({
  email: null,
  name: null,
  id: null,
  isAuthenticated: false,

  checkAuthenticated: () => {
    const accessToken = getToken();
    if (accessToken) {
      set({ isAuthenticated: true });
    }
  },

  logout: () => {
    removeToken();
    set({ email: null, name: null, isAuthenticated: false });
  },

  setUser: (email: string, name: string, id: number) => {
    set({ email, name, id, isAuthenticated: true });
  },
}));

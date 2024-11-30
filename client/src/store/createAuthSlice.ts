import { ConnectionStore } from "@/types/store";
import { StateCreator } from "zustand";

export interface AuthSlice {
  token: string;
  email: null | string;
  name: null | string;
  id: null | number;
  isAuthenticated: boolean;
  tokenRefresh: (accessToken: string) => void;
  checkAuthenticated: () => void;
  logout: () => void;
  setUser: (email: string, name: string, id: number) => void;
}

export const createAuthSlice: StateCreator<ConnectionStore, [], [], AuthSlice> = (set, get) => ({
  token: "",
  email: null,
  name: null,
  id: null,
  isAuthenticated: false,

  tokenRefresh: (accessToken: string) => set({ token: accessToken }),

  checkAuthenticated: () => {
    if (get().token) {
      set({ isAuthenticated: true });
    }
  },

  logout: () => {
    set({ email: null, name: null, isAuthenticated: false, token: "" });
  },

  setUser: (email: string, name: string, id: number) => {
    set({ email, name, id, isAuthenticated: true });
  },
});

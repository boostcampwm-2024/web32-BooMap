import { ConnectionStore } from "@/types/store";
import { StateCreator } from "zustand";

export interface AuthSlice {
  token: string;
  email: null | string;
  name: null | string;
  id: null | number;
  tokenRefresh: (accessToken: string) => void;
  logout: () => void;
  setUser: (email: string, name: string, id: number) => void;
}

export const createAuthSlice: StateCreator<ConnectionStore, [], [], AuthSlice> = (set, get) => ({
  token: "",
  email: null,
  name: null,
  id: null,

  tokenRefresh: (accessToken: string) => set({ token: accessToken }),

  logout: () => {
    set({ email: null, name: null, token: "" });
    get().resetOwnedMindMap();
  },

  setUser: (email: string, name: string, id: number) => {
    set({ email, name, id });
  },
});

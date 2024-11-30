import { ConnectionStore } from "@/types/store";
import { StateCreator } from "zustand";

export interface RoleSlice {
  currentRole: "owner" | "editor";
  updateRole: (role: "owner" | "editor") => void;
  checkRole: (connectionId: string) => void;
}

export const createRoleSlice: StateCreator<ConnectionStore, [], [], RoleSlice> = (set, get) => ({
  currentRole: "editor",

  updateRole: (role: "owner" | "editor") => set({ currentRole: role }),

  checkRole: (connectionId: string) => {
    //회원 마인드맵 중 확인
    if (get().ownedMindMap.some((ids) => ids === connectionId)) {
      get().updateRole("owner");
      return;
    }
    //비회원 마인드맵 중 확인
    if (get().ownedMindForGuest.some((ids) => ids === connectionId)) {
      get().updateRole("owner");
      return;
    }
    get().updateRole("editor");
  },
});

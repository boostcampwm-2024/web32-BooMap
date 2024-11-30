import { ConnectionStore } from "@/types/store";
import { NavigateFunction } from "react-router-dom";
import { StateCreator } from "zustand";

export interface SharedSlice {
  createConnection: (navigate: NavigateFunction, targetMode: string, isAuthenticated: boolean) => void;
}
export const createSharedSlice: StateCreator<ConnectionStore, [], [], SharedSlice> = (set, get) => ({
  createConnection: async (navigate: NavigateFunction, targetMode: string) => {
    try {
      const newMindMapConnectionId = await get().handleConnection();
      get().isAuthenticated
        ? get().addOwnedMindMap(newMindMapConnectionId)
        : get().addOwnedMindMapForGuest(newMindMapConnectionId);
      navigate(`/mindmap/${newMindMapConnectionId}?mode=${targetMode}`);
    } catch (error) {
      throw error;
    }
  },
});

import { ConnectionStore } from "@/types/store";
import { NavigateFunction } from "react-router-dom";
import { StateCreator } from "zustand";

export interface SharedSlice {
  latest: string;
  createConnection: (navigate: NavigateFunction, targetMode: string) => void;
  updateLatestMindMap: (connectionId: string) => void;
}
export const createSharedSlice: StateCreator<ConnectionStore, [], [], SharedSlice> = (set, get) => ({
  latest: "",
  createConnection: async (navigate: NavigateFunction, targetMode: string) => {
    try {
      const newMindMapConnectionId = await get().handleConnection();
      get().token
        ? get().addOwnedMindMap(newMindMapConnectionId)
        : get().addOwnedMindMapForGuest(newMindMapConnectionId);
      navigate(`/mindmap/${newMindMapConnectionId}?mode=${targetMode}`);
    } catch (error) {
      throw error;
    }
  },

  updateLatestMindMap: (connectionId: string) => set({ latest: connectionId }),
});

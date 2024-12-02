import { ConnectionStore } from "@/types/store";
import { NavigateFunction } from "react-router-dom";
import { StateCreator } from "zustand";

type NodeError = {
  message: string;
  status: string;
};

export interface SharedSlice {
  createConnection: (navigate: NavigateFunction, targetMode: string) => void;
  propagateError: (error: string, status: string) => void;
  nodeError: NodeError[];
}
export const createSharedSlice: StateCreator<ConnectionStore, [], [], SharedSlice> = (set, get) => ({
  nodeError: [],

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

  propagateError: (message, status) => {
    set({ nodeError: [...get().nodeError, { message, status }] });
  },
});

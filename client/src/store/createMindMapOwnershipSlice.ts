import { DashBoard } from "@/konva_mindmap/types/dashboard";
import { ConnectionStore } from "@/types/store";
import { StateCreator } from "zustand";

export interface MindMapOwnershipSlice {
  ownedMindMap: string[];
  ownedMindMapForGuest: string[];
  addOwnedMindMap: (connectionId: string) => void;
  addOwnedMindMapForGuest: (connectionId: string) => void;
  updateOwnedMindMap: (mindMaps: DashBoard[]) => void;
  deleteOwnedMindMap: (connectionId: string) => void;
  deleteOwnedMindMapForGuest: (connectionId: string) => void;
  resetOwnedMindMap: () => void;
}

export const createMindMapOwnershipSlice: StateCreator<ConnectionStore, [], [], MindMapOwnershipSlice> = (
  set,
  get,
) => ({
  ownedMindMap: [],
  ownedMindMapForGuest: [],

  addOwnedMindMap: (connectionId: string) => set((state) => ({ ownedMindMap: [...state.ownedMindMap, connectionId] })),
  addOwnedMindMapForGuest: (connectionId: string) =>
    set((state) => ({ ownedMindMapForGuest: [...state.ownedMindMapForGuest, connectionId] })),

  updateOwnedMindMap: (mindMaps: DashBoard[]) => {
    const userId = get().id;
    const userOwnedMaps = mindMaps.filter((map) => map.ownerId === userId).map((map) => map.connectionId);
    set({ ownedMindMap: userOwnedMaps });
  },

  deleteOwnedMindMap: (connectionId: string) =>
    set((state) => ({ ownedMindMap: state.ownedMindMap.filter((map) => map !== connectionId) })),
  deleteOwnedMindMapForGuest: (connectionId: string) =>
    set((state) => ({ ownedMindMap: state.ownedMindMap.filter((map) => map !== connectionId) })),

  resetOwnedMindMap: () => set({ ownedMindMap: [] }),
});

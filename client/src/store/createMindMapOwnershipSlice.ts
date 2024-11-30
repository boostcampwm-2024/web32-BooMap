import { ConnectionStore } from "@/types/store";
import { StateCreator } from "zustand";

export interface MindMapOwnershipSlice {
  ownedMindMap: string[];
  ownedMindForGuest: string[];
  addOwnedMindMap: (connectionId: string) => void;
  addOwnedMindMapForGuest: (connectionId: string) => void;
  updateOwnedMindMap: (mindMaps: string[] | []) => void;
  deleteOwnedMindMap: (connectionId: string) => void;
  deleteOwnedMindMapForGuest: (connectionId: string) => void;
  resetOwnedMindMap: () => void;
}

export const createMindMapOwnershipSlice: StateCreator<ConnectionStore, [], [], MindMapOwnershipSlice> = (
  set,
  get,
) => ({
  ownedMindMap: [],
  ownedMindForGuest: [],

  addOwnedMindMap: (connectionId: string) => set((state) => ({ ownedMindMap: [...state.ownedMindMap, connectionId] })),
  addOwnedMindMapForGuest: (connectionId: string) =>
    set((state) => ({ ownedMindMap: [...state.ownedMindMap, connectionId] })),

  updateOwnedMindMap: (mindMaps: string[] | []) => set({ ownedMindMap: mindMaps }),

  deleteOwnedMindMap: (connectionId: string) =>
    set((state) => ({ ownedMindMap: state.ownedMindMap.filter((map) => map !== connectionId) })),
  deleteOwnedMindMapForGuest: (connectionId: string) =>
    set((state) => ({ ownedMindMap: state.ownedMindMap.filter((map) => map !== connectionId) })),

  resetOwnedMindMap: () => set({ ownedMindMap: [] }),
});

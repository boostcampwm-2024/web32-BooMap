import { create } from "zustand";

interface SideBarStore {
  open: boolean;
  toggleSideBar: () => void;
}

export const useSideBar = create<SideBarStore>((set) => ({
  open: true,
  toggleSideBar: () =>
    set((state) => ({
      open: !state.open,
    })),
}));

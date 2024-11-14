import { Socket, io } from "socket.io-client";
import { create } from "zustand";

type mindmapState = {
  socket: Socket | null;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
};

export const useMindmapStore = create<mindmapState>((set, get) => ({
  socket: null,

  connectSocket: (id) => {
    if (get().socket) return;
    const socket = io("http://localhost:80/map", {
      // TODO: change to production URL
      query: {
        mindmapId: id,
      },
    });
    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));

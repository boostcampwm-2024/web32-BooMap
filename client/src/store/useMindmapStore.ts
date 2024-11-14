import { createMindmap } from "@/api/mindmap.api";
import { Socket, io } from "socket.io-client";
import { create } from "zustand";

type mindmapState = {
  mindMapId: string | null;
  socket: Socket | null;
  initializeMindMap: () => Promise<string>;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
  reconnectSocket: () => void;
};

export const useMindmapStore = create<mindmapState>((set, get) => ({
  mindMapId: localStorage.getItem("mindMapId") || null,
  socket: null,

  initializeMindMap: async () => {
    const response = await createMindmap();
    const mindMapId = response.data;

    set({ mindMapId: mindMapId });
    localStorage.setItem("mindMapId", mindMapId);
    return mindMapId;
  },

  connectSocket: (id) => {
    if (get().socket) return;
    const socket = io("http://localhost:80/map", {
      // TODO: change to production URL
      query: {
        mindmapId: id,
      },
    });
    set({ socket, mindMapId: id });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null });
  },

  reconnectSocket: () => {
    const id = get().mindMapId;
    if (id) get().connectSocket(id);
  },
}));

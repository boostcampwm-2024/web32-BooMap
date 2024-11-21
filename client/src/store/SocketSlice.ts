import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { actionType, createNodePayload, updateNodePayload, deleteNodePayload } from "@/types/NodePayload";

type SocketState = {
  socket: Socket | null;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
};

type HandleSocketEventProps = {
  actionType: actionType;
  payload: createNodePayload | updateNodePayload | deleteNodePayload;
  callback?: () => void;
};

export const SocketSlice = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: (id) => {
    if (get().socket) return;
    const socket = io("https://boomap.site/map", {
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

  handleSocketEvent: ({ actionType, payload, callback }: HandleSocketEventProps) => {
    const socket = get().socket;
    if (!socket) return;

    socket.off(actionType);
    socket.emit(actionType, payload);

    socket.on(actionType, (response) => {
      if (response && callback) callback();
    });
  },
}));

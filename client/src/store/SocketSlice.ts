import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { actionType, createNodePayload, updateNodePayload, deleteNodePayload } from "@/types/NodePayload";

type SocketState = {
  socket: Socket | null;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
  handleSocketEvent: (props: HandleSocketEventProps) => void;
};

type HandleSocketEventProps = {
  actionType: actionType;
  payload: createNodePayload | updateNodePayload | deleteNodePayload;
  callback?: (response?: any) => void;
};

export const SocketSlice = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: (id) => {
    if (get().socket) return;
    const socket = io("http://localhost/map", {
      // TODO: change to production URL
      query: {
        connectionId: id,
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
      if (response && callback) callback(response);
    });
  },
}));

import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { actionType, createNodePayload, updateNodePayload, deleteNodePayload } from "@/types/NodePayload";
import { createMindmap } from "@/api/mindmap.api";
import { NavigateFunction } from "react-router-dom";

type SocketState = {
  socket: Socket | null;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
  handleSocketEvent: (props: HandleSocketEventProps) => void;
  handleConnection: (navigate: NavigateFunction, targetMode: string) => void;
  wsError: string[];
  currentJobStatus: string;
};

type HandleSocketEventProps = {
  actionType: actionType;
  payload: createNodePayload | updateNodePayload | deleteNodePayload;
  callback?: (response?: any) => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  wsError: [],
  currentJobStatus: "",

  connectSocket: (id) => {
    if (get().socket) return;
    const socket = io("http://localhost/map", {
      // TODO: change to production URL
      query: {
        connectionId: id,
      },
    });
    socket.on("error", () => {
      set({ wsError: [...get().wsError, "작업 중 에러가 발생했어요"] });
      set({ currentJobStatus: "error" });
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
      set({ currentJobStatus: "success" });
    });
  },

  handleConnection: async (navigate: NavigateFunction, targetMode: string) => {
    try {
      const socket = get().socket;
      if (socket) socket.disconnect();
      const response = await createMindmap();
      const newMindMapId = response.data;
      get().connectSocket(newMindMapId);
      navigate(`/mindmap/${newMindMapId}?mode=${targetMode}`);
    } catch (error) {
      console.error(error);
    }
  },
}));

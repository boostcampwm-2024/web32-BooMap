import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { actionType, createNodePayload, updateNodePayload, deleteNodePayload } from "@/types/NodePayload";
import { createMindmap } from "@/api/mindmap.api";
import { NavigateFunction } from "react-router-dom";
import { setOwner } from "@/utils/localstorage";

type SocketState = {
  socket: Socket | null;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
  handleSocketEvent: (props: HandleSocketEventProps) => void;
  handleConnection: (navigate: NavigateFunction, targetMode: string, isAuthenticated: boolean) => void;
  wsError: string[];
  currentJobStatus: string;
  connectionStatus: string;
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
  connectionStatus: "",

  connectSocket: (id) => {
    if (get().socket) return;
    const socket = io(import.meta.env.VITE_APP_SOCKET_SERVER_BASE_URL, {
      // TODO: change to production URL
      query: {
        connectionId: id,
      },
      transports: ["websocket"],
    });

    socket.on("error", () => {
      set({ wsError: [...get().wsError, "작업 중 에러가 발생했어요"] });
      set({ currentJobStatus: "error" });
    });

    socket.on("connect_error", () => {
      set({ connectionStatus: "error" });
    });

    socket.on("reconnect", () => {
      set({ connectionStatus: "connected" });
    });

    set({ socket: socket, connectionStatus: "connected" });
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

  handleConnection: async (navigate: NavigateFunction, targetMode: string, isAuthneticated: boolean) => {
    try {
      const socket = get().socket;
      if (socket) socket.disconnect();
      const response = await createMindmap();
      const newMindMapId = response.data;
      if (!isAuthneticated) setOwner(newMindMapId);
      get().connectSocket(newMindMapId);
      navigate(`/mindmap/${newMindMapId}?mode=${targetMode}`);
    } catch (error) {
      console.error(error);
    }
  },
}));

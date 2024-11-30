import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import {
  actionType,
  createNodePayload,
  updateNodePayload,
  deleteNodePayload,
  updateTitlePayload,
  updateContentPayload,
} from "@/types/NodePayload";
import { createMindmap, getMindMap } from "@/api/mindmap.api";
import { NavigateFunction } from "react-router-dom";
import { checkOwner, getToken, setOwner } from "@/utils/localstorage";

type SocketState = {
  socket: Socket | null;
  role: "owner" | "editor" | null;
  connectSocket: (id: string, token?: string) => void;
  disconnectSocket: () => void;
  handleSocketEvent: (props: HandleSocketEventProps) => void;
  handleConnection: (navigate: NavigateFunction, targetMode: string, isAuthenticated: boolean) => void;
  getConnection: (mindMapId: number, connectionId: string) => void;
  wsError: string[];
  currentJobStatus: string;
  connectionStatus: string;
};

type HandleSocketEventProps = {
  actionType: actionType;
  payload: createNodePayload | updateNodePayload | deleteNodePayload | updateTitlePayload | updateContentPayload;
  callback?: (response?: any) => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  role: null,
  wsError: [],
  currentJobStatus: "",
  connectionStatus: "",

  connectSocket: (id, token) => {
    if (get().socket) return;
    const options: any = {
      query: {
        connectionId: id,
      },
      transports: ["websocket"],
    };
    if (token) {
      options.auth = { token };
    } else {
      checkOwner(id) ? set({ role: "owner" }) : set({ role: "editor" });
    }

    const socket = io(import.meta.env.VITE_APP_SOCKET_SERVER_BASE_URL, options);

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
    set({ socket: null, role: null });
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

  handleConnection: async (navigate: NavigateFunction, targetMode: string, isAuthenticated: boolean) => {
    try {
      const socket = get().socket;
      if (socket) socket.disconnect();
      const response = await createMindmap();
      const newMindMapId = response.data;
      if (!isAuthenticated) setOwner(newMindMapId);
      set({ role: "owner" });
      get().connectSocket(newMindMapId, isAuthenticated ? getToken() : undefined);
      navigate(`/mindmap/${newMindMapId}?mode=${targetMode}`);
    } catch (error) {
      console.error(error);
    }
  },

  getConnection: async (mindMapId: number, connectionId: string) => {
    try {
      const socket = get().socket;
      if (socket) socket.disconnect();
      const response = await getMindMap(mindMapId.toString());
      set({ role: response.role });
      get().connectSocket(connectionId);
    } catch (error) {
      throw error;
    }
  },
}));

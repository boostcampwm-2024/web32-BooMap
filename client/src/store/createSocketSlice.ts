import { Socket, io } from "socket.io-client";
import { StateCreator } from "zustand";
import {
  actionType,
  createNodePayload,
  updateNodePayload,
  deleteNodePayload,
  updateTitlePayload,
  updateContentPayload,
} from "@/types/NodePayload";
import { createMindmap, getMindMap } from "@/api/mindmap.api";
import { ConnectionStore } from "@/types/store";

export type SocketSlice = {
  socket: Socket | null;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
  handleSocketEvent: (props: HandleSocketEventProps) => void;
  handleConnection: () => Promise<string>;
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

export const createSocketSlice: StateCreator<ConnectionStore, [], [], SocketSlice> = (set, get) => ({
  socket: null,
  role: null,
  wsError: [],
  currentJobStatus: "",
  connectionStatus: "",

  connectSocket: (connectionId) => {
    const options: any = {
      query: {
        connectionId,
      },
      transports: ["websocket"],
    };

    get().checkRole(connectionId);

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
    set({ socket: null });
    get().updateRole("editor");
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

  handleConnection: async () => {
    try {
      const socket = get().socket;
      if (socket) socket.disconnect();
      const response = await createMindmap();
      const newMindMapId = response.data;
      get().connectSocket(newMindMapId);
      return newMindMapId;
    } catch (error) {
      console.error(error);
    }
  },

  getConnection: async (mindMapId: number, connectionId: string) => {
    try {
      const socket = get().socket;
      if (socket) socket.disconnect();
      const response = await getMindMap(mindMapId.toString());
      get().connectSocket(connectionId);
    } catch (error) {
      throw error;
    }
  },
});

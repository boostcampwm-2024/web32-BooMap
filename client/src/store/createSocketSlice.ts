import { Socket, io } from "socket.io-client";
import { StateCreator } from "zustand";
import { actionType, HandleSocketEventPayloads } from "@/types/NodePayload";
import { createMindmap, getMindMap, getMindMapByConnectionId } from "@/api/mindmap.api";
import { ConnectionStore } from "@/types/store";

type NodeError = {
  message: string;
  status: string;
};

export type SocketSlice = {
  socket: Socket | null;
  connectSocket: (id: string) => void;
  disconnectSocket: () => void;
  handleSocketEvent: (props: HandleSocketEventProps) => void;
  handleConnection: () => Promise<string>;
  getConnection: (mindMapId: number, connectionId: string) => void;
  nodeError: NodeError[];
  currentJobStatus: string;
  connectionStatus: string;
};

type HandleSocketEventProps = {
  actionType: actionType;
  payload?: HandleSocketEventPayloads;
  callback?: (response?: any) => void;
};

export const createSocketSlice: StateCreator<ConnectionStore, [], [], SocketSlice> = (set, get) => ({
  socket: null,
  role: null,
  nodeError: [],
  currentJobStatus: "",
  connectionStatus: "",

  connectSocket: (connectionId) => {
    if (get().socket) return;

    const options: any = {
      query: {
        connectionId,
      },
      transports: ["websocket"],
    };

    const token = get().token;
    if (token) options.auth = { token };

    get().checkRole(connectionId);

    const socket = io(import.meta.env.VITE_APP_SOCKET_SERVER_BASE_URL, options);
    sessionStorage.setItem("latest", connectionId);

    socket.on("notFoundError", async () => {
      try {
        const response = await getMindMapByConnectionId(connectionId);
        if (response) {
          get().disconnectSocket();
          get().connectSocket(connectionId);
        }
      } catch (error) {
        if (error.status === 404) set({ connectionStatus: "notFound" });
        if (error.status === 403) set({ connectionStatus: "forbidden" });
      }
    });

    socket.on("error", () => {
      set({ nodeError: [...get().nodeError, { message: "작업 중 에러가 발생했어요", status: "fail" }] });
      set({ currentJobStatus: "error" });
    });

    socket.on("connect_error", () => {
      set({ connectionStatus: "error" });
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
      const connectionId = response.data.connectionId;
      return connectionId;
    } catch (error) {
      throw error;
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

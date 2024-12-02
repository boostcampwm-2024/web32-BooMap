import { createRoleSlice, RoleSlice } from "@/store/createRoleSlice";
import { createSocketSlice, SocketSlice } from "@/store/createSocketSlice";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import { createMindMapOwnershipSlice, MindMapOwnershipSlice } from "@/store/createMindMapOwnershipSlice";
import { ConnectionStore } from "@/types/store";
import { createSharedSlice } from "@/store/createSharedSlice";
import { createAuthSlice } from "@/store/createAuthSlice";

export const useConnectionStore = create<ConnectionStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createRoleSlice(...a),
        ...createSocketSlice(...a),
        ...createSharedSlice(...a),
        ...createAuthSlice(...a),
        ...createMindMapOwnershipSlice(...a),
      }),
      {
        name: "connectionStore",
        partialize: (state) => {
          return {
            token: state.token,
            ownedMindMap: state.ownedMindMap,
            ownedMindMapForGuest: state.ownedMindMapForGuest,
            latest: state.latest,
          };
        },
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
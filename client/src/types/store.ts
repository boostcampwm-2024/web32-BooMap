import { AuthSlice } from "@/store/createAuthSlice";
import { MindMapOwnershipSlice } from "@/store/createMindMapOwnershipSlice";
import { RoleSlice } from "@/store/createRoleSlice";
import { SharedSlice } from "@/store/createSharedSlice";
import { SocketSlice } from "@/store/createSocketSlice";

export type ConnectionStore = RoleSlice & MindMapOwnershipSlice & SharedSlice & SocketSlice & AuthSlice;

import { NodeData } from "./Node";

export type actionType = "createNode" | "deleteNode" | "updateNode";

export type createNodePayload = {
  id: number;
  keyword: string;
  depth: number;
  location: { x: number; y: number };
  children: number[] | [];
  newNode: boolean;
  parentId: number | null;
};

export type deleteNodePayload = {
  id: string[];
};

export type updateNodePayload = NodeData;

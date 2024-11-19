import { NodeData } from "./Node";

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
  id: number[];
};

export type updateNodePayload = NodeData;

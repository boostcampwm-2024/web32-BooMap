import { Location } from "@/konva_mindmap/types/location";

export type Node = {
  id: number;
  keyword: string;
  depth: number;
  location: Location;
  children: number[] | [];
  newNode?: boolean;
};

export type NodeData = Record<number, Node>;

export type SelectedNode = {
  nodeId: number;
  parentNodeId: number;
};

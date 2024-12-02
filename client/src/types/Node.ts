import { Location } from "@/konva_mindmap/types/location";
import Konva from "konva";
import { RefObject } from "react";

export type Node = {
  id: number;
  keyword: string;
  depth: number;
  location: Location;
  children: number[];
  newNode?: boolean;
};

export type NodeData = Record<number, Node>;

export type SelectedNode = {
  nodeId?: number;
  parentNodeId?: number;
};

export type NodeProps = {
  data: NodeData;
  parentNode?: Node;
  node: Node;
  depth: number;
  parentRef?: RefObject<Konva.Group>;
  dragmode: boolean;
};

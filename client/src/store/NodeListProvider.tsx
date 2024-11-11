import useHistoryState from "@/hooks/useHistoryState";
import { Node } from "@/types/Node";
import { createContext, ReactNode, useContext, useState } from "react";
        
export type NodeListContextType = {
  data: NodeData | null;
  updateNodeList: (nodeList: NodeData) => void;
  undo: () => void;
  redo: () => void;
};

const nodeData = {
  1: {
    id: 1,
    keyword: "점심메뉴",
    depth: 1,
    location: { x: 50, y: 50 },
    children: [2, 3],
  },
  2: {
    id: 2,
    keyword: "양식",
    depth: 2,
    location: { x: 100, y: 100 },
    children: [4, 5],
  },
  3: {
    id: 3,
    keyword: "한식",
    depth: 2,
    location: { x: 50, y: 50 },
    children: [6, 7],
  },
  4: {
    id: 4,
    keyword: "면",
    depth: 3,
    location: { x: 50, y: 50 },
    children: [],
  },
  5: {
    id: 5,
    keyword: "밥",
    depth: 3,
    location: { x: 50, y: 50 },
    children: [],
  },
  6: {
    id: 6,
    keyword: "고기",
    depth: 3,
    location: { x: 50, y: 50 },
    children: [],
  },
  7: {
    id: 7,
    keyword: "찌개",
    depth: 3,
    location: { x: 50, y: 50 },
    children: [],
  },
};

const NodeListContext = createContext<NodeListContextType | undefined>(undefined);
export function useNodeListContext() {
  const context = useContext(NodeListContext);
  if (!context) {
    throw new Error("useNodeListContext must be used within a NodeListProvider");
  }
  return context;
}

export default function NodeListProvider({ children }: { children: ReactNode }) {
  const { state: data, setState: setData, undo, redo } = useHistoryState<NodeData>(nodeData);

  function updateNodeList(id: number, updatedNode: Node) {
    setData((prevData) => prevData.map((node) => (node.id === id ? { ...node, ...updatedNode } : node)));
  }

  return <NodeListContext.Provider value={{ data, updateNodeList, undo, redo }}>{children}</NodeListContext.Provider>;
}

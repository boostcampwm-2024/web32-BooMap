import { Node } from "@/types/Node";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type NodeListContextType = {
  data: Node | null;
  updateNodeList: (nodeList: Node) => void;
};

const nodeData = {
  content: "대분류",
  location: { x: 24.1515, y: 211.214124 },
  children: [
    {
      content: "중분류1",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류1-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류1-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "중분류2",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "소분류2-1",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
        {
          content: "소분류2-2",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
  ],
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
  const [data, setData] = useState<Node>(nodeData);

  function updateNodeList(nodeList: Node) {
    setData(nodeList);
  }

  return <NodeListContext.Provider value={{ data, updateNodeList }}>{children}</NodeListContext.Provider>;
}

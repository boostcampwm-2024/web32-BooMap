import { Node } from "@/types/Node";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type NodeListContextType = {
  data: Node | null;
  updateNodeList: (nodeList: Node) => void;
};

const nodeData = {
  content: "qwrqwrqwrqwrqwrqwrqwrqw",
  location: { x: 24.1515, y: 211.214124 },
  children: [
    {
      content: "qwrqwrqwr",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "qwrqwr",
          location: { x: 24.1515, y: 211.214124 },
          children: [],
        },
      ],
    },
    {
      content: "qwrqwrqwr",
      location: { x: 24.1515, y: 211.214124 },
      children: [
        {
          content: "qwrqwr",
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

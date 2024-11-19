import useHistoryState from "@/hooks/useHistoryState";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";
import { Node, NodeData, SelectedNode } from "@/types/Node";
import { createContext, ReactNode, useContext, useState } from "react";
import { SocketSlice } from "./SocketSlice";

export type NodeListContextType = {
  data: NodeData | null;
  selectedNode: { nodeId: number; parentNodeId: number } | null;
  history: string[];
  updateNode: (id: number, node: Partial<Node>) => void;
  overrideNodeData: (node: NodeData | ((newData: NodeData) => void)) => void;
  saveHistory: (newState: string) => void;
  undoData: () => void;
  redoData: () => void;
  selectNode: ({ nodeId, parentNodeId }: SelectedNode) => void;
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
  const [data, setData] = useState({});
  const [selectedNode, setSelectedNode] = useState({ nodeId: 0, parentNodeId: 0 });
  const { saveHistory, undo, redo, history } = useHistoryState<NodeData>(JSON.stringify(data));

  const socket = SocketSlice.getState().socket;
  socket?.on("joinRoom", (nodeData) => {
    console.log("joinRoom", nodeData);
    setData({ ...initializeNodePosition(nodeData) });
  });

  function updateNode(id: number, updatedNode: Partial<Node>) {
    setData((prevData) => ({
      ...prevData,
      [id]: { ...prevData[id], ...updatedNode },
    }));
  }

  function overrideNodeData(newData) {
    setData(newData);
  }

  function undoData() {
    undo(setData);
  }

  function redoData() {
    redo(setData);
  }

  function selectNode({ nodeId, parentNodeId }: SelectedNode) {
    if (!nodeId) {
      setSelectedNode({ nodeId: 0, parentNodeId: 0 });
      return;
    }
    setSelectedNode({
      nodeId,
      parentNodeId,
    });
  }

  return (
    <NodeListContext.Provider
      value={{
        data,
        updateNode,
        overrideNodeData,
        undoData,
        redoData,
        saveHistory,
        selectNode,
        selectedNode,
        history,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
}

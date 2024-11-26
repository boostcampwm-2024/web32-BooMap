import useGroupSelect from "@/hooks/useGroupSelect";
import useHistoryState from "@/hooks/useHistoryState";
import { Node, NodeData, SelectedNode } from "@/types/Node";
import Konva from "konva";
import { createContext, ReactNode, useContext, useState } from "react";
import { useSocketStore } from "./useSocketStore";
import { deleteNodes } from "@/konva_mindmap/events/deleteNode";

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
  title: string;
  updateTitle: (title: string) => void;
  groupSelect: (group: Konva.Group[]) => void;
  groupRelease: () => void;
  selectedGroup: string[];
  loading: boolean;
  deleteSelectedNodes: () => void;
};

const mindMapInfo = { title: "제목 없는 마인드맵" };

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
  const { saveHistory, overrideHistory, undo, redo, history } = useHistoryState<NodeData>(JSON.stringify(data));
  const [title, setTitle] = useState(mindMapInfo.title);
  const [loading, setLoading] = useState(true);
  const { selectedGroup, groupRelease, groupSelect } = useGroupSelect();
  const socket = useSocketStore((state) => state.socket);

  socket?.on("joinRoom", (initialData) => {
    setLoading(true);
    setTimeout(() => {
      setData({ ...initialData });
      overrideHistory(JSON.stringify(initialData));
      setLoading(false);
    }, 0);
  });

  socket?.on("updateNode", (updatedNodeData) => {
    overrideNodeData(updatedNodeData);
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

  function updateTitle(title: string) {
    setTitle(title);
  }

  function deleteSelectedNodes() {
    if (selectedGroup.length) {
      deleteNodes(JSON.stringify(data), selectedGroup.map(Number), overrideNodeData);
    }
    if (selectedNode.nodeId) deleteNodes(JSON.stringify(data), selectedNode.nodeId, overrideNodeData);
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
        title,
        updateTitle,
        groupSelect,
        groupRelease,
        selectedGroup,
        loading,
        deleteSelectedNodes,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
}

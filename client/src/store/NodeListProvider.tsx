import useGroupSelect from "@/hooks/useGroupSelect";
import useHistoryState from "@/hooks/useHistoryState";
import { Node, NodeData, SelectedNode } from "@/types/Node";
import Konva from "konva";
import { createContext, ReactNode, useContext, useState } from "react";

import { useSocketStore } from "./useSocketStore";
import { deleteNodes } from "@/konva_mindmap/events/deleteNode";
import { checkOwner, setLatestMindMap } from "@/utils/localstorage";

export type NodeListContextType = {
  data: NodeData | null;
  selectedNode: SelectedNode | null;
  history: string[];
  updateNode: (id: number, node: Partial<Node>) => void;
  overrideNodeData: (node: NodeData | ((newData: NodeData) => void)) => void;
  saveHistory: (newState: string) => void;
  undoData: () => void;
  redoData: () => void;
  selectNode: ({ nodeId, parentNodeId, addTo }: SelectedNode) => void;
  title: string;
  updateTitle: (title: string) => void;
  groupSelect: (group: Konva.Group[]) => void;
  groupRelease: () => void;
  selectedGroup: string[];
  loading: boolean;
  deleteSelectedNodes: () => void;
  updateMindMapId: (mindMapId: string) => void;
  isOwner: boolean;
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
  const [selectedNode, setSelectedNode] = useState<SelectedNode>({ nodeId: 0, parentNodeId: 0, addTo: "canvas" });
  const { saveHistory, overrideHistory, undo, redo, history } = useHistoryState<NodeData>(JSON.stringify(data));
  const [title, setTitle] = useState(mindMapInfo.title);
  const [loading, setLoading] = useState(true);
  const [mindMapId, setMindMapId] = useState("");
  const [isOwner, setOwner] = useState(false);
  const { selectedGroup, groupRelease, groupSelect } = useGroupSelect();
  const socket = useSocketStore((state) => state.socket);

  socket?.on("joinRoom", (initialData) => {
    setLoading(true);
    setTimeout(() => {
      setData({ ...initialData.nodeData });
      overrideHistory(JSON.stringify(initialData));
      setLoading(false);
      if (!initialData.isOwner) setOwner(checkOwner(mindMapId));
    }, 0);
  });

  socket?.on("updateNode", (updatedNodeData) => {
    overrideNodeData(updatedNodeData);
  });

  socket?.on("disconnect", () => {
    setData({});
    overrideHistory(JSON.stringify({}));
    setLatestMindMap(mindMapId);
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

  function selectNode({ nodeId, parentNodeId, addTo }: SelectedNode) {
    if (!nodeId) {
      setSelectedNode({ nodeId: 0, parentNodeId: 0, addTo: addTo });
      return;
    }
    setSelectedNode({
      nodeId,
      parentNodeId,
      addTo,
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
  function updateMindMapId(mindMapId: string) {
    setMindMapId(mindMapId);
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
        updateMindMapId,
        isOwner,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
}

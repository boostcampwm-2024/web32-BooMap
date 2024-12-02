import useGroupSelect from "@/hooks/useGroupSelect";
import useHistoryState from "@/hooks/useHistoryState";
import { Node, NodeData, SelectedNode } from "@/types/Node";
import Konva from "konva";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { deleteNodes } from "@/konva_mindmap/events/deleteNode";
import useMindMapTitle from "@/hooks/useMindMapTitle";
import useContent from "@/hooks/useContent";
import { useConnectionStore } from "@/store/useConnectionStore";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";

export type NodeListContextType = {
  data: NodeData | null;
  selectedNode: SelectedNode | null;
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
  content: string;
  updateContent: (updatedContent: string) => void;
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
  const [selectedNode, setSelectedNode] = useState<SelectedNode>({ nodeId: 0, parentNodeId: 0 });
  const { saveHistory, overrideHistory, undo, redo, history } = useHistoryState<NodeData>(JSON.stringify(data));
  const { title, initializeTitle, updateTitle } = useMindMapTitle();
  const { content, updateContent, initializeContent } = useContent();
  const [loading, setLoading] = useState(true);
  const { selectedGroup, groupRelease, groupSelect } = useGroupSelect();
  const socket = useConnectionStore((state) => state.socket);
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);

  useEffect(() => {
    socket?.on("joinRoom", (initialData) => {
      setLoading(true);
      setTimeout(() => {
        setData({ ...initialData.nodeData });
        overrideHistory(JSON.stringify(initialData));
        initializeTitle(initialData);
        initializeContent(initialData);
        setLoading(false);
      }, 0);
    });

    socket?.on("updateNode", (updatedNodeData) => {
      console.log("updatedNodeData", updatedNodeData);
      overrideNodeData(updatedNodeData);
    });

    socket?.on("updateTitle", (updatedTitle) => {
      updateTitle(updatedTitle.title);
    });

    socket?.on("updateContent", (updatedContent) => {
      updateContent(updatedContent.content);
    });

    socket?.on("disconnect", () => {
      setData({});
      overrideHistory(JSON.stringify({}));
    });

    socket?.on("aiResponse", (response) => {
      const initializedNodes = initializeNodePosition(response);
      handleSocketEvent({
        actionType: "updateNode",
        payload: initializedNodes,
        callback: (response) => {
          overrideNodeData(response);
        },
      });
    });

    return () => {
      socket?.off;
    };
  }, [socket]);

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
        content,
        updateContent,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
}

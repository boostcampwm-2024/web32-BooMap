import useHistoryState from "@/hooks/useHistoryState";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";
import { Node, NodeData, SelectedNode } from "@/types/Node";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type NodeListContextType = {
  data: NodeData | null;
  selectedNode: { nodeId: number; parentNodeId: number } | null;
  updateNode: (id: number, node: Node) => void;
  overrideNodeData: (node: NodeData | ((newData: NodeData) => void)) => void;
  saveHistory: (newState: string) => void;
  undoData: () => void;
  redoData: () => void;
  selectNode: ({ nodeId, parentNodeId }: SelectedNode) => void;
  focusNodeId: number | null;
  updateFocusNodeId: (newId: number | null) => void;
};

const nodeData = {
  1: {
    id: 1,
    keyword: "점심메뉴",
    depth: 1,
    location: { x: null, y: null },
    children: [2, 3, 11, 15, 23],
  },
  2: {
    id: 2,
    keyword: "양식",
    depth: 2,
    location: { x: null, y: null },
    children: [4, 5, 6, 7, 21, 22],
  },
  3: {
    id: 3,
    keyword: "한식",
    depth: 2,
    location: { x: null, y: null },
    children: [8, 9, 10],
  },
  4: {
    id: 4,
    keyword: "파스타",
    depth: 3,
    location: { x: null, y: null },
    children: [],
  },
  5: {
    id: 5,
    keyword: "스테이크",
    depth: 3,
    location: { x: null, y: null },
    children: [],
  },
  6: {
    id: 6,
    keyword: "샐러드",
    depth: 3,
    location: { x: null, y: null },
    children: [],
  },
  7: {
    id: 7,
    keyword: "스프",
    depth: 3,
    location: { x: 180, y: 300 },
    children: [],
  },
  8: {
    id: 8,
    keyword: "김치찌개",
    depth: 3,
    location: { x: 320, y: 300 },
    children: [],
  },
  9: {
    id: 9,
    keyword: "된장찌개",
    depth: 3,
    location: { x: 340, y: 300 },
    children: [],
  },
  10: {
    id: 10,
    keyword: "제육볶음",
    depth: 3,
    location: { x: 360, y: 300 },
    children: [],
  },
  11: {
    id: 11,
    keyword: "중식",
    depth: 2,
    location: { x: 500, y: 250 },
    children: [12, 13, 14],
  },
  12: {
    id: 12,
    keyword: "짜장면",
    depth: 3,
    location: { x: 520, y: 300 },
    children: [],
  },
  13: {
    id: 13,
    keyword: "짬뽕",
    depth: 3,
    location: { x: 540, y: 300 },
    children: [],
  },
  14: {
    id: 14,
    keyword: "탕수육",
    depth: 3,
    location: { x: 560, y: 300 },
    children: [],
  },
  15: {
    id: 15,
    keyword: "디저트",
    depth: 2,
    location: { x: 700, y: 250 },
    children: [16, 17, 18, 19, 20],
  },
  16: {
    id: 16,
    keyword: "아이스크림",
    depth: 3,
    location: { x: 720, y: 300 },
    children: [],
  },
  17: {
    id: 17,
    keyword: "케이크",
    depth: 3,
    location: { x: 740, y: 300 },
    children: [],
  },
  18: {
    id: 18,
    keyword: "쿠키",
    depth: 3,
    location: { x: 760, y: 300 },
    children: [],
  },
  19: {
    id: 19,
    keyword: "빵",
    depth: 3,
    location: { x: 760, y: 300 },
    children: [],
  },
  20: {
    id: 20,
    keyword: "붕어빵",
    depth: 3,
    location: { x: 760, y: 300 },
    children: [],
  },
  21: {
    id: 21,
    keyword: "감바스",
    depth: 3,
    location: { x: 760, y: 300 },
    children: [],
  },
  22: {
    id: 22,
    keyword: "치즈피자 페퍼로니피자 핫치킨피자",
    depth: 3,
    location: { x: 760, y: 300 },
    children: [],
  },
  23: {
    id: 23,
    keyword: "일식",
    depth: 2,
    location: { x: 0, y: 0 },
    children: [24, 25],
  },
  24: {
    id: 24,
    keyword: "초밥",
    depth: 3,
    location: { x: 0, y: 0 },
    children: [],
  },
  25: {
    id: 25,
    keyword: "장어덮밥",
    depth: 3,
    location: { x: 0, y: 0 },
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

const dummy = initializeNodePosition(nodeData);
export default function NodeListProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({ ...dummy });
  const [selectedNode, setSelectedNode] = useState({ nodeId: 0, parentNodeId: 0 });
  const { saveHistory, undo, redo } = useHistoryState<NodeData>(JSON.stringify(data));
  const [focusNodeId, setFocusNodeId] = useState(null);

  function updateNode(id: number, updatedNode: Node) {
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

  function updateFocusNodeId(newId: number | null) {
    setFocusNodeId(newId);
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
        focusNodeId,
        updateFocusNodeId,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
}

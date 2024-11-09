import useHistoryState from "@/hooks/useHistoryState";
import { Node, NodeData } from "@/types/Node";
import { createContext, ReactNode, useContext } from "react";

export type NodeListContextType = {
  data: NodeData | null;
  updateNodeList: (nodeList: NodeData) => void;
  undo: () => void;
  redo: () => void;
};

const nodeData = {
	1 : {
		"id": 1,
		"keyword" : "점심메뉴",
		"depth" : 1,
		"location": { "x" : 24.1515, "y": 211.214124 },
		"children": [2, 3]
	},
	2 : {
		"id": 2,
		"keyword" : "양식",
		"depth" : 2,
		"location": { "x" : 24.1515, "y": 211.214124 },
		"children": [4, 5]
	},
	3 : {
		"id": 3,
		"depth" : 2,
		"keyword" : "한식",
		"location": { "x" : 24.1515, "y": 211.214124 },
		"children": [6, 7]
	},
	4 : {
		"id": 4,
		"depth" : 3,
		"keyword" : "면",
		"location": { "x" : 24.1515, "y": 211.214124 },
		"children": []
	},
	5 : {
		"id": 5,
		"depth" : 3,
		"keyword" : "밥",
		"location": { "x" : 24.1515, "y": 211.214124 },
		"children": []
	},
	6 : {
		"id": 6,
		"depth" : 3,
		"keyword" : "고기",
		"location": { "x" : 24.1515, "y": 211.214124 },
		"children": []
	},
	7 : {
		"id": 7,
		"depth" : 3,
		"keyword" : "찌개",
		"location": { "x" : 24.1515, "y": 211.214124 },
		"children": []
	},
}

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

  function updateNodeList(nodeList: Node) {
    setData(nodeList);
  }

  return <NodeListContext.Provider value={{ data, updateNodeList, undo, redo }}>{children}</NodeListContext.Provider>;
}

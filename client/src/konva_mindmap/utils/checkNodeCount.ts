import { NodeData } from "@/types/Node";

export function checkNodeCount(data: NodeData, id: number) {
  const nodeData = data[id];
  const childrenCount = nodeData.children.length;
  if (childrenCount >= 15) return false;
  return true;
}

export function checkAllNodeCount(data: NodeData) {
  const allNodeCount = Object.keys(data).length;
  if (allNodeCount >= 150) return false;
  return true;
}

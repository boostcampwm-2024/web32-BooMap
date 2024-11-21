import { NodeData } from "@/types/Node";

export function findRootNodeKey(data: NodeData) {
  return Number(Object.keys(data).find((key) => data[key].depth === 1));
}

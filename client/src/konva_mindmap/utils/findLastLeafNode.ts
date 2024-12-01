import { NodeData } from "@/types/Node";

export function findLastLeafNode(data: NodeData, nodeId: number) {
  const currentNode = data[nodeId];

  if (!currentNode.children || currentNode.children.length === 0) {
    return nodeId;
  }

  return findLastLeafNode(data, currentNode.children[currentNode.children.length - 1]);
}

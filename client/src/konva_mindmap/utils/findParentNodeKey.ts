import { NodeData } from "@/types/Node";

export function findParentNodeKey(nodeId: number, data: NodeData) {
  for (const id in data) {
    const node = data[parseInt(id)];
    if (node.children.includes(nodeId)) {
      return node.id;
    }
  }
  return null;
}

export function getParentNodeKeys(nodeId: number, data: NodeData) {
  const parentNodes: number[] = [];
  let currentNodeId: number | null = nodeId;

  while (currentNodeId !== null) {
    const parentNodeId = findParentNodeKey(currentNodeId, data);
    if (parentNodeId !== null) {
      parentNodes.push(parentNodeId);
      currentNodeId = parentNodeId;
    } else {
      break;
    }
  }

  return parentNodes;
}

import { findLastLeafNode } from "./findLastLeafNode";
import { findParentNodeKey } from "./findParentNodeKey";
import { findRootNodeKey } from "./findRootNodeKey";

export function moveToNextNode(data, selectedNode, selectNode) {
  const { nodeId, parentNodeId } = selectedNode;
  const currentNode = data[nodeId];

  if (!currentNode) {
    console.error("현재 노드를 찾을 수 없습니다.");
    return;
  }

  if (currentNode.children && currentNode.children.length > 0) {
    selectNode({ nodeId: currentNode.children[0], parentNodeId: nodeId });
    return;
  }

  let currentParentNodeId = parentNodeId;
  let currentNodeId = nodeId;
  let nodeFound = false;

  while (currentParentNodeId !== null) {
    const parentNode = data[currentParentNodeId];
    if (!parentNode) break;

    const currentIndex = parentNode.children.indexOf(currentNodeId);
    if (currentIndex < parentNode.children.length - 1) {
      selectNode({
        nodeId: parentNode.children[currentIndex + 1],
        parentNodeId: currentParentNodeId,
      });
      nodeFound = true;
      return;
    }

    currentNodeId = currentParentNodeId;
    currentParentNodeId = findParentNodeKey(currentParentNodeId, data);
  }

  if (!nodeFound) {
    const rootNodeKey = findRootNodeKey(data);
    selectNode({
      nodeId: data[rootNodeKey].id,
      parentNodeId: 0,
    });
  }
}

export function moveToPreviousNode(data, selectedNode, selectNode) {
  const { nodeId, parentNodeId } = selectedNode;
  const currentNode = data[nodeId];
  const parentNode = data[parentNodeId];

  if (!currentNode) {
    console.error("현재 노드를 찾을 수 없습니다.");
    return;
  }

  if (!parentNodeId) {
    const rootNodeKey = findRootNodeKey(data);
    const lastLeafNodeId = findLastLeafNode(data, rootNodeKey);
    selectNode({ nodeId: lastLeafNodeId, parentNodeId: findParentNodeKey(lastLeafNodeId, data) });
    return;
  }
  const currentIndex = parentNode.children.indexOf(nodeId);
  if (currentIndex > 0) {
    const previousNodeId = parentNode.children[currentIndex - 1];
    const lastLeafNodeId = findLastLeafNode(data, previousNodeId);
    if (previousNodeId !== lastLeafNodeId) {
      selectNode({
        nodeId: lastLeafNodeId,
        parentNodeId: findParentNodeKey(lastLeafNodeId, data),
      });
      return;
    }
    selectNode({
      nodeId: previousNodeId,
      parentNodeId: parentNodeId,
    });
    return;
  } else {
    selectNode({
      nodeId: parentNodeId,
      parentNodeId: findParentNodeKey(parentNodeId, data),
    });
  }
}

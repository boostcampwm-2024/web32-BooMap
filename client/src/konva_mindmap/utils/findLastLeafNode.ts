export function findLastLeafNode(data, nodeId) {
  const currentNode = data[nodeId];

  if (!currentNode.children || currentNode.children.length === 0) {
    return nodeId;
  }

  return findLastLeafNode(data, currentNode.children[currentNode.children.length - 1]);
}

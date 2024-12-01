export function findParentNodeKey(nodeId, data) {
  for (const id in data) {
    const node = data[parseInt(id)];
    if (node.children.includes(nodeId)) {
      return node.id;
    }
  }
  return null;
}

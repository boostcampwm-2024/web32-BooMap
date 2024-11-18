import { Node, NodeData } from "@/types/Node";

export function deleteNode(data: string, selectedNodeId: number, overrideNodeData) {
  if (!selectedNodeId) return;
  const newNodeData: NodeData = JSON.parse(data);

  function deleteNodeAndChildren(nodeId: number) {
    const node = newNodeData[nodeId];
    if (node.children) {
      [...node.children].forEach((childId) => {
        deleteNodeAndChildren(childId);
      });
    }

    Object.values(newNodeData).forEach((node) => {
      if (node.children) {
        node.children = node.children.filter((id) => id !== nodeId);
      }
    });

    delete newNodeData[nodeId];
  }

  deleteNodeAndChildren(selectedNodeId);
  overrideNodeData(newNodeData);
}

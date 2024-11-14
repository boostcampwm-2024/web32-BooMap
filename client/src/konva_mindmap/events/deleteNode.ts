import { Node, NodeData } from "@/types/Node";

export function deleteNode(data: string, selectedNodeId: number, update) {
  if (!selectedNodeId) return;
  const nodeData: NodeData = JSON.parse(data);

  // 객체를 복사하여 불변성 유지
  const targetData = nodeData[selectedNodeId];

  Object.values(nodeData).forEach((node: Node) => {
    node.children = node.children.filter((childId) => childId !== selectedNodeId);
  });

  targetData.children?.forEach((childId) => {
    deleteNode(data, childId, update);
  });

  delete nodeData[selectedNodeId];
  update(nodeData);
}

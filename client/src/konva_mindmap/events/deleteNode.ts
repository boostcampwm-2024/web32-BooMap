import { useSocketStore } from "@/store/useSocketStore";
import { NodeData } from "@/types/Node";

export function deleteNodes(data: string, selectedNodeIds: number | number[], overrideNodeData) {
  const newNodeData: NodeData = JSON.parse(data);

  const nodeIds = Array.isArray(selectedNodeIds) ? selectedNodeIds : [selectedNodeIds];
  if (nodeIds.some((id) => !id || !newNodeData[id])) return;

  function deleteNodeAndChildren(nodeId: number) {
    const node = newNodeData[nodeId];
    if (!node) return;
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

  nodeIds.forEach((nodeId) => deleteNodeAndChildren(nodeId));

  const socket = useSocketStore.getState().socket;
  if (socket) {
    socket.off("updateNode");
    socket.emit("updateNode", newNodeData);
    socket.on("updateNode", (response) => {
      if (response) {
        overrideNodeData(response);
      }
      return;
    });
  }
}

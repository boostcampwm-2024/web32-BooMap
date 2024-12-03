import { NodeData } from "@/types/Node";
import { findRootNodeKey } from "../utils/findRootNodeKey";
import { useConnectionStore } from "@/store/useConnectionStore";

export function deleteNodes(data: string, selectedNodeIds: number | number[], overrideNodeData) {
  const newNodeData: NodeData = JSON.parse(data);
  const rootKey = findRootNodeKey(newNodeData);

  if (Array.isArray(selectedNodeIds) && selectedNodeIds.includes(rootKey)) {
    useConnectionStore.getState().propagateError("최상위 노드는 삭제되지 않습니다", "error");
    return deleteNodes(data, [...newNodeData[rootKey].children], overrideNodeData);
  }
  if (!Array.isArray(selectedNodeIds) && selectedNodeIds === rootKey) {
    useConnectionStore.getState().propagateError("최상위 노드는 삭제되지 않습니다", "error");
    return;
  }

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

  const handleSocketEvent = useConnectionStore.getState().handleSocketEvent;
  handleSocketEvent({
    actionType: "updateNode",
    payload: newNodeData,
    callback: (response) => {
      if (response) {
        overrideNodeData(response);
      }
    },
  });
}

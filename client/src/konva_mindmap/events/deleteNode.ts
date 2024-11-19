import { SocketSlice } from "@/store/SocketSlice";
import { Node, NodeData } from "@/types/Node";

export function deleteNode(data: string, selectedNodeId: number, overrideNodeData) {
  if (!selectedNodeId) return;
  const nodeData: NodeData = JSON.parse(data);

  const nodeIdsToDelete: number[] = [];

  // 삭제 대상이 되는 노드의 id를 먼저 수집
  function collectNodeIdsToDelete(nodeId: number) {
    if (!nodeId) return;

    // 객체를 복사하여 불변성 유지
    const targetData = nodeData[nodeId];
    nodeIdsToDelete.push(nodeId);

    targetData.children?.forEach((childId) => {
      collectNodeIdsToDelete(childId);
    });
  }
  collectNodeIdsToDelete(selectedNodeId);

  // 소켓으로 서버에 데이터를 전송
  const socket = SocketSlice.getState().socket;
  if (socket && nodeIdsToDelete.length > 0) {
    // 기존 이벤트 리스너 제거 (무한 렌더링 방지)
    socket.off("deleteNode");
    // 형식에 맞추어 데이터 전송
    socket.emit("deleteNode", { id: nodeIdsToDelete });
    // 응답이 오면 상태 업데이트 후 updateNode 이벤트 발생
    socket.on("deleteNode", (response) => {
      if (response) {
        nodeIdsToDelete.forEach((nodeId) => {
          Object.values(nodeData).forEach((node: Node) => {
            node.children = node.children.filter((childId) => childId !== nodeId);
          });
          delete nodeData[nodeId];
          overrideNodeData(nodeData);
        });
        socket.emit("updateNode", { ...nodeData });
      }
    });
  }
}

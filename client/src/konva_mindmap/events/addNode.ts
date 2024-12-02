import { NodeData, SelectedNode } from "@/types/Node";
import { NODE_DEPTH_LIMIT } from "@/constants/node";
import { useConnectionStore } from "@/store/useConnectionStore";
import { getNewNodePosition } from "../utils/getNewNodePosition";
import { checkAllNodeCount, checkNodeCount } from "../utils/checkNodeCount";

export function addNode(
  data: NodeData,
  selectedNode: SelectedNode,
  overrideNodeData: React.Dispatch<React.SetStateAction<NodeData>>,
  onNodeCreated?: (id: number) => void,
) {
  const handleSocketEvent = useConnectionStore.getState().handleSocketEvent;

  if (selectedNode.nodeId === 0) {
    useConnectionStore.getState().propagateError("노드가 선택되지 않았습니다.", "error");
    return;
  }

  const isCheckNodeCount = checkNodeCount(data, selectedNode.nodeId);
  const isCheckAllNodeCount = checkAllNodeCount(data);

  if (!isCheckNodeCount) {
    useConnectionStore.getState().propagateError("한 노드당 최대 15개 생성 가능해요.", "error");
    return;
  }
  if (!isCheckAllNodeCount) {
    useConnectionStore.getState().propagateError("노드는 최대 150개까지 생성 가능해요.", "error");
    return;
  }

  // 아무 노드도 없을 때는 임의로 id 생성해서 현재는 넣음
  if (!Object.keys(data).length) {
    const newNode = {
      [1]: {
        id: 1,
        keyword: "제목 없음",
        depth: 1,
        location: {
          x: 0,
          y: 0,
        },
        children: [],
      },
    };
    handleSocketEvent({
      actionType: "createNode",
      payload: newNode[1],
      callback: (response) => {
        if (response) {
          const updatedData = {
            [response.id]: { ...newNode[1], id: response.id },
          };
          overrideNodeData(updatedData);
          handleSocketEvent({
            actionType: "updateNode",
            payload: updatedData,
          });
          onNodeCreated?.(response.id);
        }
      },
    });
    return;
  }
  if (!selectedNode.nodeId || data[selectedNode.nodeId].depth === NODE_DEPTH_LIMIT) return;

  const newNodeId = parseInt(Object.keys(data)[Object.keys(data).length - 1]) + 1;
  // 소켓으로 서버에 데이터를 전송할 때도 사용하기 위해 변수로 따로 빼서 관리
  const newNode = {
    id: newNodeId,
    keyword: "제목없음",
    depth: data[selectedNode.nodeId].depth + 1,
    location: getNewNodePosition(data[selectedNode.nodeId].children, data, data[selectedNode.nodeId]),
    children: [],
  };

  handleSocketEvent({
    actionType: "createNode",
    payload: { ...newNode, parentId: selectedNode.nodeId },
    callback: (response) => {
      if (response) {
        const updatedData = {
          ...data,
          [selectedNode.nodeId]: {
            ...data[selectedNode.nodeId],
            children: [...data[selectedNode.nodeId].children, response.id],
          },
          [response.id]: { ...newNode, id: response.id },
        };
        overrideNodeData(updatedData);
        handleSocketEvent({
          actionType: "updateNode",
          payload: updatedData,
        });
        onNodeCreated?.(response.id);
      }
    },
  });
  return newNodeId;
}

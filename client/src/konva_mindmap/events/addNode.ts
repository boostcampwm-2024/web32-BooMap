import { calculateVector } from "@/konva_mindmap/utils/vector";
import { Node, NodeData, SelectedNode } from "@/types/Node";
import { findRootNodeKey } from "../utils/findRootNodeKey";
import { NODE_DEPTH_LIMIT } from "@/constants/node";
import { useConnectionStore } from "@/store/useConnectionStore";

//newNode 플래그를 바꿔 실제 노드들과 상호작용할 수 있는 노드로 변환
export function addNode(keyword: string, newNodeId: number, updateNode: (id: number, node: Partial<Node>) => void) {
  updateNode(newNodeId, {
    keyword: keyword,
    newNode: false,
  });
}

//바로 편집창이 On되어 있는 노드를 추가하는 함수
export function showNewNode(
  data: NodeData,
  selectedNode: SelectedNode,
  overrideNodeData: React.Dispatch<React.SetStateAction<NodeData>>,
) {
  const handleSocketEvent = useConnectionStore.getState().handleSocketEvent;
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
        newNode: true,
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
    newNode: true,
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
      }
    },
  });
  return newNodeId;
}

// 수직벡터 -> 벡터 구한 다음에 벡터의 y값이 x값으로 가고 x값의 반대 부호값이 y좌표
// 단위벡터 * 내가 원하는 만큼 떼놓을 거리값을 마지막 요소의 x와 y좌표에 더한다,
function getNewNodePosition(children: number[], data: NodeData, parentNode: Node) {
  const rootKey = findRootNodeKey(data);

  if (!children.length) {
    if (parentNode.id === rootKey)
      return {
        x: parentNode.location.x + 300,
        y: parentNode.location.y,
      };
    const { x, y } = calculateVector(data[rootKey].location, parentNode.location, -80, 240);
    return parentNode ? { x: parentNode.location.x + x, y: parentNode.location.y + y } : { x: 0, y: 0 };
  }
  const lastChildren = data[children[children.length - 1]];
  const uv = calculateVector(parentNode.location, lastChildren.location, 110, 240);
  return {
    x: lastChildren.location.x + uv.x,
    y: lastChildren.location.y + uv.y,
  };
}

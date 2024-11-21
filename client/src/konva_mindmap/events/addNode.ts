import { unitVector } from "@/konva_mindmap/utils/vector";
import { SocketSlice } from "@/store/SocketSlice";
import { Node, NodeData, SelectedNode } from "@/types/Node";

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
  const socket = SocketSlice.getState().socket;
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
    if (socket) {
      socket.emit("createNode", newNode[1]);
      socket.on("createNode", (response) => {
        if (response) {
          const updatedData = { [response.id]: { ...newNode[1], id: response.id } };
          overrideNodeData(updatedData);
          socket.emit("updateNode", updatedData);
        }
      });
    }
    return;
  }
  if (!selectedNode.nodeId || data[selectedNode.nodeId].depth === 3) return;

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

  if (socket) {
    // 기존에 있던 리스너 제거
    socket.off("createNode");
    // 서버에 새로운 노드 생성 요청
    socket.emit("createNode", { ...newNode, parentId: selectedNode.nodeId });

    // 서버에서 응답이 오면 updateNode 이벤트 발생, 전체 데이터 전송
    socket.on("createNode", (response) => {
      if (response) {
        const updatedData = {
          ...data,
          [selectedNode.nodeId]: {
            ...data[selectedNode.nodeId],
            children: [...data[selectedNode.nodeId].children, newNodeId],
          },
          [response.id]: { ...newNode, id: response.id },
        };
        overrideNodeData(updatedData);
        socket.emit("updateNode", updatedData);
      }
    });
  }
  return newNodeId;
}

// 수직벡터 -> 벡터 구한 다음에 벡터의 y값이 x값으로 가고 x값의 반대 부호값이 y좌표
// 단위벡터 * 내가 원하는 만큼 떼놓을 거리값을 마지막 요소의 x와 y좌표에 더한다,
function getNewNodePosition(children: number[], data: NodeData, parentNode: Node) {
  if (!children.length) {
    return parentNode ? { x: parentNode.location.x + 30, y: parentNode.location.y + 30 } : { x: 0, y: 0 };
  }
  const lastChildren = data[children[children.length - 1]];
  const uv = unitVector(parentNode.location, lastChildren.location);

  return {
    x: lastChildren.location.x + uv.x * 50,
    y: lastChildren.location.y + uv.y * 50,
  };
}

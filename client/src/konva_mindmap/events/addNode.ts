import { unitVector } from "@/konva_mindmap/utils/vector";
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
  // 아무 노드도 없을 때는 임의로 id 생성해서 현재는 넣음
  if (!Object.keys(data).length) {
    overrideNodeData({
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
    });
    return;
  }
  if (!selectedNode.nodeId || data[selectedNode.nodeId].depth === 3) return;

  const newNodeId = parseInt(Object.keys(data)[Object.keys(data).length - 1]) + 1;
  if (selectedNode.parentNodeId) {
    overrideNodeData((prev) => ({
      ...prev,
      [selectedNode.nodeId]: {
        ...data[selectedNode.nodeId],
        children: [...data[selectedNode.nodeId].children, newNodeId],
      },
      [newNodeId]: {
        id: newNodeId,
        // keyword, depth, location 보내면 id 받고 id 받은걸로 상태 업데이트
        keyword: "제목없음",
        depth: data[selectedNode.nodeId].depth + 1,
        location: getNewNodePosition(data[selectedNode.nodeId].children, data, data[selectedNode.nodeId]),
        children: [],
        newNode: true,
      },
    }));
  }

  overrideNodeData((prev) => ({
    ...prev,
    [selectedNode.nodeId]: {
      ...data[selectedNode.nodeId],
      children: [...data[selectedNode.nodeId].children, newNodeId],
    },
    [newNodeId]: {
      id: newNodeId,
      keyword: "제목 없음",
      depth: data[selectedNode.nodeId].depth + 1,
      location: getNewNodePosition(data[selectedNode.nodeId].children, data, data[selectedNode.nodeId]),
      children: [],
      newNode: true,
    },
  }));
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

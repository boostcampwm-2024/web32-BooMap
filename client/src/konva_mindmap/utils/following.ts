import { Location } from "@/konva_mindmap/types/location";
import { Node, NodeData } from "@/types/Node";

class OffsetManager {
  private savedOffsets: Map<number, Location> = new Map();

  saveOffset(nodeId: number, offset: Location): void {
    this.savedOffsets.set(nodeId, offset);
  }

  getOffset(nodeId: number): Location | undefined {
    return this.savedOffsets.get(nodeId);
  }

  reset(): void {
    this.savedOffsets.clear();
  }
}

const offsetManager = new OffsetManager();
const maxDistance = 400;

export function checkFollowing(
  data: NodeData,
  root: Node,
  currPos: Location,
  updateNode: (id: number, updates: Partial<Node>) => void,
): NodeData {
  if (!root.children || root.children.length === 0) return;
  root.children.forEach((childId) => {
    const childNode = data[childId];
    if (!childNode) return;
    const newLocation = adjustNodePositions(root, childNode, currPos);
    updateNode(childId, { location: newLocation });
    checkFollowing(data, childNode, newLocation, updateNode);
  });
}

export function saveOffsets(data: NodeData, root: Node): void {
  if (!root.children || !root.location) return;

  root.children.forEach((childNodeId) => {
    const childNode = data[childNodeId];
    if (!childNode || !childNode.location) return;

    const offsets: Location = {
      x: childNode.location.x - root.location.x,
      y: childNode.location.y - root.location.y,
    };

    offsetManager.saveOffset(childNodeId, offsets);

    // 재귀적으로 자식 노드들의 offset 저장
    saveOffsets(data, childNode);
  });
}

export function resetSavedOffsets(): void {
  offsetManager.reset();
}

export function reconcileOffsets(
  data: NodeData,
  root: Node,
  updateNode: (id: number, updates: Partial<Node>) => void,
  updatedParentLocation?: Location,
): NodeData {
  let updatedData = { ...data };

  if (!root.children || !root.location) return updatedData;

  root.children.forEach((childNodeId) => {
    const childNode = updatedData[childNodeId];
    if (!childNode) return;

    const offset = offsetManager.getOffset(childNodeId);
    if (!offset) return;

    const newLocation = {
      x: updatedParentLocation ? updatedParentLocation.x + offset.x : root.location.x + offset.x,
      y: updatedParentLocation ? updatedParentLocation.y + offset.y : root.location.y + offset.y,
    };

    updatedData[childNode.id] = { ...childNode, location: newLocation };
    updatedData = reconcileOffsets(updatedData, childNode, updateNode, newLocation);
  });

  return updatedData;
}

export function adjustNodePositions(parentNode: Node, targetNode: Node, currPos: Location): Location {
  if (!parentNode.location || !targetNode.location) return;

  // 저장된 오프셋 가져오기
  const offset = offsetManager.getOffset(targetNode.id);
  if (!offset) return;

  // 부모 노드의 현재 위치에 저장된 오프셋을 더해서 자식 노드의 위치 계산
  const newLocation: Location = {
    x: currPos.x + offset.x,
    y: currPos.y + offset.y,
  };
  return newLocation;
}

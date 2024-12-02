import { Node, NodeData } from "@/types/Node";
import { findRootNodeKey } from "./findRootNodeKey";
import { calculateVector } from "./vector";

export function getNewNodePosition(children: number[], data: NodeData, parentNode: Node) {
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

import { NodeData } from "@/types/Node";
import { findRootNodeKey } from "./findRootNodeKey";
import { calculateVector } from "./vector";
import { NODE_RADIUS } from "./nodeAttrs";

const lineLength = [360, 360, 360, 270];
const angle = [104, 105, 103, 104];
const distance = [240, 200, 160, 120];

export function getNewNodePosition(data: NodeData, nodeId: number) {
  const rootKey = findRootNodeKey(data);
  const node = data[nodeId];
  const children = node.children;
  const depth = node.depth;

  if (!children.length) {
    if (node.id === rootKey)
      return {
        x: node.location.x + NODE_RADIUS(depth) * 7,
        y: node.location.y,
      };
    const { x, y } = calculateVector(data[rootKey].location, node.location, -60, lineLength[depth - 1]);
    return node ? { x: node.location.x + x, y: node.location.y + y } : { x: 0, y: 0 };
  }
  const lastChildren = data[children[children.length - 1]];
  const uv = calculateVector(node.location, lastChildren.location, angle[depth - 1], distance[depth - 1]);
  return {
    x: lastChildren.location.x + uv.x,
    y: lastChildren.location.y + uv.y,
  };
}

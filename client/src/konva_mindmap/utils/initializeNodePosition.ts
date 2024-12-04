import { NodeData } from "@/types/Node";
import { findRootNodeKey } from "./findRootNodeKey";
import { NODE_RADIUS } from "./nodeAttrs";
import { calculateVector } from "./vector";

type CalculateNodePositionParams = {
  nodeId: number;
  length: number;
  index: number;
  xPos: number;
  yPos: number;
};

export default function initializeNodePosition(data: NodeData) {
  if (!Object.keys(data).length) return data;

  const rootKey = findRootNodeKey(data);
  const rootLocation = data[rootKey].location;

  calculateNodePosition({
    nodeId: rootKey,
    length: 0,
    index: 0,
    xPos: 0,
    yPos: 0,
  });

  function findAncestor(data: NodeData, targetId: number, level: number) {
    function findParent(data, childId) {
      for (const key in data) {
        const node = data[key];
        if (node.children && node.children.includes(childId)) {
          return node;
        }
      }
      return null;
    }

    let currentNodeId = targetId;
    let currentLevel = 0;
    while (currentLevel < level) {
      const parent = findParent(data, currentNodeId);
      if (!parent) return null;
      currentNodeId = parent.id;
      currentLevel++;
    }
    return data[currentNodeId];
  }

  function calculateNodePosition({ nodeId, length, index, xPos, yPos }: CalculateNodePositionParams) {
    const node = data[nodeId];
    const depth = node.depth;
    const radius = NODE_RADIUS(depth);

    const applyVectorAdjustment = (origin: { x: number; y: number }, angle: number, distance: number) => {
      const { x, y } = calculateVector(origin, { x: xPos, y: yPos }, angle, distance);
      xPos += x;
      yPos += y;
    };

    switch (depth) {
      case 2: {
        const angle = (360 / length) * index;
        const radianAngle = (Math.PI / 180) * angle;
        xPos += radius * Math.cos(radianAngle) * 8;
        yPos += radius * Math.sin(radianAngle) * 8;
        break;
      }
      case 3: {
        const divideAngle = 180 / (length + 1);
        const adjustedAngle = divideAngle * (index + 1) - 90;
        applyVectorAdjustment(rootLocation, adjustedAngle, 360);
        break;
      }
      case 4: {
        const divideAngle = 180 / (length + 3);
        const adjustedAngle = divideAngle * (index + 2) - 90;
        applyVectorAdjustment(rootLocation, adjustedAngle, 360);
        break;
      }
      case 5: {
        const ancestor = findAncestor(data, nodeId, 2);
        const divideAngle = 180 / (length + 1);
        const adjustedAngle = divideAngle * (index + 1) - 90;
        const calculatedDistance =
          Math.sqrt((2 * radius * radius) / (1 - Math.cos((Math.PI / 180) * divideAngle))) * 1.8;
        const maxDistance = Math.max(calculatedDistance, 200);
        applyVectorAdjustment(ancestor.location, adjustedAngle, maxDistance);
        break;
      }
      default:
        break;
    }
    node.location.x = xPos;
    node.location.y = yPos;

    {
      node.children.map((childId: number, childIndex: number) => {
        calculateNodePosition({
          nodeId: childId,
          length: node.children.length,
          xPos,
          yPos,
          index: childIndex,
        });
      });
    }
  }
  return data;
}

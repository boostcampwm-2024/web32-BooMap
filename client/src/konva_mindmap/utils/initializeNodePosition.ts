import { NodeData } from "@/types/Node";

type CalculateNodePositionParams = {
  nodeId: number;
  length: number;
  index: number;
  xPos: number;
  yPos: number;
  angle: number;
};

export default function initializeNodePosition(data: NodeData) {
  if (!Object.keys(data).length) return data;
  calculateNodePosition({
    nodeId: 1,
    length: 0,
    index: 0,
    xPos: 0,
    yPos: 0,
    angle: 0,
  });

  function calculateNodePosition({ nodeId, length, index, xPos, yPos, angle }: CalculateNodePositionParams) {
    const node = data[nodeId];
    const depth = node.depth;
    const radius = 60 - 10 * depth;

    if (depth === 2) {
      angle = (360 / length) * index;
      const radianAngle = (Math.PI / 180) * angle;
      xPos += radius * length * 0.8 * Math.cos(radianAngle);
      yPos += radius * length * 0.8 * Math.sin(radianAngle);
    } else if (depth === 3) {
      const divideAngle = 180 / (length + 1);
      const adjustedAngle = angle - 90 + divideAngle * (index + 1);
      const radianAngle = (Math.PI / 180) * adjustedAngle;

      const calculatedDistance = Math.sqrt((2 * radius * radius) / (1 - Math.cos((Math.PI / 180) * divideAngle))) + 30;
      const distance = Math.max(calculatedDistance, 100);
      xPos += distance * Math.cos(radianAngle);
      yPos += distance * Math.sin(radianAngle);
    }
    node.location.x = xPos;
    node.location.y = yPos;

    {
      node.children.map((childId, childIndex) => {
        calculateNodePosition({
          nodeId: childId,
          length: node.children.length,
          xPos,
          yPos,
          index: childIndex,
          angle,
        });
      });
    }
  }
  return data;
}

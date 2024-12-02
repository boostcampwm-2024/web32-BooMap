import { Location } from "@/konva_mindmap/types/location";

export function calculateVector(
  rootNodeLocation: Location,
  parentNodeLocation: Location,
  angleDegrees: number,
  magnitude = 1,
) {
  const dx = parentNodeLocation.x - rootNodeLocation.x;
  const dy = parentNodeLocation.y - rootNodeLocation.y;

  const length = Math.sqrt(dx ** 2 + dy ** 2);
  const unitX = dx / length;
  const unitY = dy / length;

  const angleRadians = (angleDegrees * Math.PI) / 180;
  const rotatedX = unitX * Math.cos(angleRadians) - unitY * Math.sin(angleRadians);
  const rotatedY = unitX * Math.sin(angleRadians) + unitY * Math.cos(angleRadians);

  return {
    x: rotatedX * magnitude,
    y: rotatedY * magnitude,
  };
}

import Konva from "konva";
import { Shape } from "konva/lib/Shape";

export function isCollided(r1: Konva.RectConfig, r2: Konva.RectConfig) {
  return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
}

export function moveOnCollision(
  targetNode: Konva.Group | Shape<Konva.GroupConfig>,
  draggedNode: Konva.Group | Shape<Konva.GroupConfig>,
) {
  const dx = targetNode.attrs.x - draggedNode.attrs.x;
  const dy = targetNode.attrs.y - draggedNode.attrs.y;
  if (Math.sqrt(dx * dx + dy * dy) === 0) {
    return {
      x: targetNode.attrs.x + Math.random() * 20,
      y: targetNode.attrs.y,
    };
  }

  const angle = Math.atan2(dy, dx);

  const minDistance = 10;

  const moveX = Math.cos(angle) * minDistance;
  const moveY = Math.sin(angle) * minDistance;

  return {
    x: targetNode.attrs.x + moveX,
    y: targetNode.attrs.y + moveY,
  };
}

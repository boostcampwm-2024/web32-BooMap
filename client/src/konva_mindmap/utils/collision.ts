import Konva from "konva";
import { Shape } from "konva/lib/Shape";

export function checkCollision(layer: React.MutableRefObject<Konva.Layer>, update) {
  const children = layer.current.children;
  for (let i = 0; i < children.length; i++) {
    const base = children[i];
    if (base.attrs.name !== "node") continue;
    for (let j = 0; j < children.length; j++) {
      const target = children[j];
      if (target.attrs.name !== "node") continue;
      if (isCollided(base, target)) {
        const newPosition = moveOnCollision(target, base);
        update(parseInt(target.attrs.id), { location: newPosition });
      }
    }
  }
}

export function isCollided(
  node: Konva.Group | Shape<Konva.GroupConfig>,
  target: Konva.Group | Shape<Konva.GroupConfig>,
) {
  if (node === target) return false;
  return haveIntersection(node.getClientRect(), target.getClientRect());
}

export function haveIntersection(r1: Konva.RectConfig, r2: Konva.RectConfig) {
  return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
}

export function moveOnCollision(
  targetNode: Konva.Group | Shape<Konva.GroupConfig>,
  draggedNode: Konva.Group | Shape<Konva.GroupConfig>,
) {
  const dx = targetNode.attrs.x - draggedNode.attrs.x;
  const dy = targetNode.attrs.y - draggedNode.attrs.y;
  const angle = Math.atan2(dy, dx);

  const minDistance = 5;

  const moveX = Math.cos(angle) * minDistance;
  const moveY = Math.sin(angle) * minDistance;

  return {
    x: targetNode.attrs.x + moveX,
    y: targetNode.attrs.y + moveY,
  };
}

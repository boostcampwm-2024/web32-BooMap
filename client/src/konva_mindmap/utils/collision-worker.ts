// collision-worker.ts

import { Location } from "@/konva_mindmap/types/location";
import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";

interface CollisionMessage {
  type: "detectCollisions";
  nodes: CollisionNode[];
}
interface CollisionNode {
  id: string;
  location: Location;
  rect: RectConfig;
}

interface CollisionResult {
  type: "collisionResult";
  collisions: {
    targetId: number;
    newPosition: { x: number; y: number };
  }[];
}

function isCollided(r1: Konva.RectConfig, r2: Konva.RectConfig): boolean {
  return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
}

function moveOnCollision(targetNode: CollisionNode, draggedNode: CollisionNode) {
  const dx = targetNode.location.x - draggedNode.location.x;
  const dy = targetNode.location.y - draggedNode.location.y;
  if (Math.sqrt(dx * dx + dy * dy) === 0) {
    return {
      x: targetNode.location.x + Math.random() * 20,
      y: targetNode.location.y,
    };
  }

  const angle = Math.atan2(dy, dx);

  const minDistance = 10;

  const moveX = Math.cos(angle) * minDistance;
  const moveY = Math.sin(angle) * minDistance;

  return {
    x: targetNode.location.x + moveX,
    y: targetNode.location.y + moveY,
  };
}

self.addEventListener("message", (event: MessageEvent<CollisionMessage>) => {
  if (event.data.type === "detectCollisions") {
    const nodes = event.data.nodes;
    const collisions: CollisionResult["collisions"] = [];
    // 각 노드에 대해 충돌 검사
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        const baseNode = nodes[i];
        const targetNode = nodes[j];

        if (isCollided(baseNode.rect, targetNode.rect) && baseNode.id !== targetNode.id) {
          // 충돌 시 이동 위치 계산
          const newPosition = moveOnCollision(targetNode, baseNode);

          collisions.push({
            targetId: Number(targetNode.id),
            newPosition,
          });
        }
      }
    }

    // 충돌 결과 전송
    self.postMessage({
      type: "collisionResult",
      collisions,
    } as CollisionResult);
  }
});

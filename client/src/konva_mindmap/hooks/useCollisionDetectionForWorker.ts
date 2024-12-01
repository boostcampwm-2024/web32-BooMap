import { useCallback, useRef, useEffect, useState } from "react";
import Konva from "konva";
import { Node, NodeData } from "@/types/Node";

export function useCollisionDetection(nodeData: NodeData, updateNode: (id: number, updates: Partial<Node>) => void) {
  const [collisionWorker, setCollisionWorker] = useState<Worker | null>(null);
  const layer = useRef<Konva.Layer>(null);

  // Web Worker 초기화
  useEffect(() => {
    const worker = new Worker(new URL("../utils/collision-worker.ts", import.meta.url));

    worker.onmessage = (event) => {
      if (event.data.type === "collisionResult") {
        event.data.collisions.forEach((collision) => {
          updateNode(collision.targetId, {
            location: {
              x: collision.newPosition.x,
              y: collision.newPosition.y,
            },
          });
        });
      }
    };

    setCollisionWorker(worker);

    return () => {
      worker.terminate();
    };
  }, []); // 의존성 배열에서 updateNode 제거

  // 드래그 중 충돌 감지 트리거
  const detectCollisions = useCallback(() => {
    if (layer.current && collisionWorker) {
      const nodes = layer.current.children
        .filter((child) => child.attrs.name === "node")
        .map((node) => ({
          id: node.attrs.id,
          location: {
            x: node.attrs.x,
            y: node.attrs.y,
          },
          rect: node.getClientRect(),
        }));

      // 노드 상태가 실제로 변경된 경우에만 충돌 감지
      collisionWorker.postMessage({
        type: "detectCollisions",
        nodes,
      });
    }
  }, [collisionWorker]);

  // 드래그 이벤트에 연결
  useEffect(() => {
    requestAnimationFrame(detectCollisions);
  }, [detectCollisions, layer, nodeData]);

  return layer;
}

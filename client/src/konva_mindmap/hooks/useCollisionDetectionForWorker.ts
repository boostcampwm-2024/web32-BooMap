import { useCallback, useRef, useEffect, useState } from "react";
import Konva from "konva";
import { Node, NodeData } from "@/types/Node";

export function useCollisionDetection(nodeData: NodeData, updateNode: (id: number, updates: Partial<Node>) => void) {
  const [collisionWorker, setCollisionWorker] = useState<Worker | null>(null);
  const layer = useRef<Konva.Layer>(null);

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
  }, []);

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

      collisionWorker.postMessage({
        type: "detectCollisions",
        nodes,
      });
    }
  }, [collisionWorker]);

  useEffect(() => {
    requestAnimationFrame(detectCollisions);
  }, [detectCollisions, layer, nodeData]);

  return layer;
}

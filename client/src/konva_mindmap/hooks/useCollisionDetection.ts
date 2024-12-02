import { useCallback, useRef, useEffect, useLayoutEffect } from "react";
import Konva from "konva";
import { isCollided, moveOnCollision } from "@/konva_mindmap/utils/collision";
import { Node, NodeData } from "@/types/Node";
import { throttle } from "@/konva_mindmap/utils/throttle";

export function useCollisionDetection(nodeData: NodeData, updateNode: (id: number, updates: Partial<Node>) => void) {
  const layer = useRef<Konva.Layer>(null);

  const handleCollision = useCallback(
    (base, target) => {
      const newTargetPosition = moveOnCollision(target, base);
      updateNode(target.attrs.id, { location: newTargetPosition });
    },
    [nodeData, updateNode],
  );

  const detectCollisions = useCallback(
    (layer) => {
      const nodes = layer.children.filter((child) => child.attrs.name === "node");
      nodes.forEach((base) => {
        nodes.forEach((target) => {
          if (base !== target) {
            if (isCollided(base.children[0].getClientRect(), target.children[0].getClientRect())) {
              handleCollision(base, target);
            }
          }
        });
      });
    },
    [handleCollision],
  );

  const throttledDetectCollisions = useCallback(() => {
    throttle(() => {
      if (layer.current) {
        requestAnimationFrame(() => {
          detectCollisions(layer.current);
        });
      }
    }, 16);
  }, [detectCollisions]);

  useLayoutEffect(() => {
    if (layer.current) {
      throttledDetectCollisions();
    }
  }, [nodeData, layer, detectCollisions]);

  return layer;
}

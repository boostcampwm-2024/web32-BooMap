import { useCallback, useRef, useEffect } from "react";
import Konva from "konva";
import { isCollided, moveOnCollision } from "@/konva_mindmap/utils/collision";
import { Node, NodeData } from "@/types/Node";

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
    (layer: Konva.Layer) => {
      const nodes = layer.children.filter((child) => child.attrs.name === "node");
      nodes.forEach((base) => {
        nodes.forEach((target) => {
          if (base !== target) {
            if (isCollided(base.getClientRect(), target.getClientRect())) {
              handleCollision(base, target);
            }
          }
        });
      });
    },
    [handleCollision],
  );

  useEffect(() => {
    if (layer.current) {
      requestAnimationFrame(() => {
        detectCollisions(layer.current);
      });
    }
  }, [nodeData, layer, detectCollisions]);

  return layer;
}

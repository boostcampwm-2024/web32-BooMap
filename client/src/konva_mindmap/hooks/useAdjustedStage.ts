import { useEffect, useState } from "react";
import { NodeData } from "@/types/Node";
import { findRootNodeKey } from "../utils/findRootNodeKey";

export function useAdjustedStage(data: NodeData, containerWidth: number, containerHeight: number) {
  const [adjustedDimensions, setAdjustedDimensions] = useState({ scale: 1, x: 0, y: 0 });

  const rootKey = findRootNodeKey(data);

  useEffect(() => {
    const bounds = calculateBounds(data, rootKey);
    const newDimensions = adjustStageToFit(bounds);
    setAdjustedDimensions(newDimensions);
  }, [containerWidth, containerHeight, data]);

  //그림이 그려지는 영역 크기 계산
  function calculateBounds(data: NodeData, rootId: number) {
    const stack = [data[rootId]];
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    while (stack.length > 0) {
      const node = stack.pop();
      if (!node || node.location.x === null || node.location.y === null) continue;

      minX = Math.min(minX, node.location.x);
      minY = Math.min(minY, node.location.y);
      maxX = Math.max(maxX, node.location.x);
      maxY = Math.max(maxY, node.location.y);

      node.children?.forEach((childId) => stack.push(data[childId]));
    }

    return { minX, minY, maxX, maxY };
  }

  //그림 영역에 따른 canvas 크기 조정
  function adjustStageToFit(bounds: { minX: number; minY: number; maxX: number; maxY: number }) {
    const width = bounds.maxX - bounds.minX + 200;
    const height = bounds.maxY - bounds.minY + 200;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;
    const scale = Math.min(scaleX, scaleY);

    return {
      scale,
      x: containerWidth / 2,
      y: containerHeight / 2,
    };
  }

  return adjustedDimensions;
}

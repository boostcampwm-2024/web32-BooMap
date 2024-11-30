import { ratioSizing } from "@/konva_mindmap/events/ratioSizing";
import { useAdjustedStage } from "@/konva_mindmap/hooks/useAdjustedStage";
import { StageDimension } from "@/konva_mindmap/types/dimension";
import { findRootNodeKey } from "@/konva_mindmap/utils/findRootNodeKey";
import { useEffect, useRef, useState } from "react";

export default function useDimension(data) {
  const [dimensions, setDimensions] = useState<StageDimension>({
    scale: 1,
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });
  const targetRef = useRef<HTMLDivElement>(null);
  const { adjustedDimensions, adjustStageToFit, calculateBounds } = useAdjustedStage(
    data,
    dimensions.width,
    dimensions.height,
  );

  useEffect(() => {
    resizing();
    const resizeObserver = new ResizeObserver(() => {
      resizing();
    });

    if (targetRef.current) {
      resizeObserver.observe(targetRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [targetRef]);

  useEffect(() => {
    centerMoveMap();
  }, [adjustedDimensions]);

  function centerMoveMap() {
    setDimensions((prev) => ({
      ...prev,
      ...adjustedDimensions,
    }));
  }

  function reArrange() {
    const rootKey = findRootNodeKey(data);
    const bounds = calculateBounds(data, rootKey);
    const newDimensions = adjustStageToFit(bounds);
    if (dimensions.x === newDimensions.x && dimensions.y === newDimensions.y) {
      setDimensions((prev) => ({
        ...prev,
        scale: newDimensions.scale,
        x: prev.x + 1,
        y: prev.y + 1,
      }));
      return;
    }
    setDimensions((prev) => ({
      ...prev,
      ...newDimensions,
    }));
  }

  function resizing() {
    if (targetRef.current) {
      setDimensions((prevDimensions) => ({
        ...prevDimensions,
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
        x: targetRef.current.offsetWidth / 2,
        y: targetRef.current.offsetHeight / 2,
      }));
    }
  }
  function handleWheel(e) {
    ratioSizing(e, dimensions, setDimensions);
  }

  function zoomIn() {
    setDimensions((prevDimensions) => ({
      ...prevDimensions,
      scale: prevDimensions.scale + 0.05,
    }));
  }

  function zoomOut() {
    setDimensions((prevDimensions) => ({
      ...prevDimensions,
      scale: prevDimensions.scale - 0.05 < 0.05 ? 0.05 : prevDimensions.scale - 0.05,
    }));
  }

  return {
    targetRef,
    dimensions,
    handleWheel,
    zoomIn,
    zoomOut,
    centerMoveMap,
    reArrange,
  };
}

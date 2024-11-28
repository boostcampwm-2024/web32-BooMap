import { getSelectedNodes } from "@/konva_mindmap/utils/select";
import { useNodeListContext } from "@/store/NodeListProvider";
import Konva from "konva";
import { RefObject, useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";

export default function SelectionRect({ stage, dragmode }: { stage: RefObject<Konva.Stage>; dragmode: boolean }) {
  const { groupSelect, groupRelease, selectedNode, selectNode } = useNodeListContext();
  const [rectOption, setRectOption] = useState({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const selectionRectangle = useRef<Konva.Rect>(null);
  const currentRectRef = useRef(rectOption);

  useEffect(() => {
    currentRectRef.current = rectOption;
  }, [rectOption]);

  useEffect(() => {
    if (!stage.current) return;
    const currentStage = stage.current;
    if (dragmode) {
      setRectOption({
        ...rectOption,
        visible: false,
      });
      return;
    }

    const handleMouseDown = (e) => {
      if (dragmode || e.target.getParent()?.attrs.name === "node") return;
      if (!e.target.getParent() || e.target.getParent().attrs.id !== selectedNode.nodeId) {
        selectNode({});
      }
      const pos = currentStage.getRelativePointerPosition();
      setStartPoint({ x: pos.x, y: pos.y });

      const newRectOption = {
        visible: true,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      };
      setRectOption(newRectOption);
      currentRectRef.current = newRectOption;
    };

    const handleMouseMove = (e) => {
      if (!currentRectRef.current.visible || dragmode || e.target.getParent()?.attrs.name === "node") return;
      e.evt.preventDefault();
      const pos = currentStage.getRelativePointerPosition();
      const newRectOption = {
        ...currentRectRef.current,
        x: Math.min(startPoint.x, pos.x),
        y: Math.min(startPoint.y, pos.y),
        width: Math.abs(pos.x - startPoint.x),
        height: Math.abs(pos.y - startPoint.y),
      };
      setRectOption(newRectOption);
      currentRectRef.current = newRectOption;
    };

    const handleMouseUp = () => {
      if (dragmode) return;
      if (currentRectRef.current.width > 0 && currentRectRef.current.height > 0) {
        const selectedNodes = getSelectedNodes(currentStage.children[0], currentRectRef.current);
        groupSelect(selectedNodes as Konva.Group[]);
      }

      setStartPoint({ x: 0, y: 0 });
      setRectOption({
        visible: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      currentRectRef.current = {
        visible: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    };

    currentStage.on("mousedown touchstart", handleMouseDown);
    currentStage.on("mousemove touchmove", handleMouseMove);
    currentStage.on("mouseup touchend", handleMouseUp);
    currentStage.on("click", groupRelease);

    return () => {
      currentStage.off("mousedown touchstart", handleMouseDown);
      currentStage.off("mousemove touchmove", handleMouseMove);
      currentStage.off("mouseup touchend", handleMouseUp);
      currentStage.off("click", groupRelease);
    };
  }, [stage, startPoint, groupSelect, dragmode]);

  return (
    <Rect
      ref={selectionRectangle}
      x={rectOption.x}
      y={rectOption.y}
      width={rectOption.width}
      height={rectOption.height}
      fill="rgba(0, 161, 255, 0.3)"
      visible={rectOption.visible}
    />
  );
}

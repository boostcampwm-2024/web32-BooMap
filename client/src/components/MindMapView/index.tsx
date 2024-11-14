import Konva from "konva";
import useDimension from "@/konva_mindmap/hooks/useDimension";
import useWindowKeyEventListener from "@/hooks/useWindowKeyEventListener";
import DrawMindMap from "@/konva_mindmap/components/DrawMindMap";
import ToolMenu from "@/components/MindMapView/ToolMenu";
import { Button } from "@headlessui/react";
import { useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { checkCollision } from "@/konva_mindmap/utils/collision";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";

export default function MindMapView() {
  const { data, undoData: undo, redoData: redo, updateNode, overrideNodeData, saveHistory } = useNodeListContext();
  const { dimensions, targetRef, handleWheel, zoomIn, zoomOut } = useDimension(data);
  const layer = useRef<Konva.Layer>();

  useEffect(() => {
    checkCollision(layer, updateNode);
  }, [data]);

  const keyMap = {
    z: undo,
    y: redo,
  };
  function handleReArrange() {
    const savedData = JSON.stringify(data);
    saveHistory(savedData);
    overrideNodeData(initializeNodePosition(JSON.parse(savedData)));
  }

  useWindowKeyEventListener("keydown", (e) => {
    if (e.ctrlKey && keyMap[e.key]) {
      keyMap[e.key]();
    }
    if (e.metaKey && keyMap[e.key]) {
      keyMap[e.key]();
    }
  });

  return (
    <div ref={targetRef} className="relative h-full min-h-0 w-full min-w-0 rounded-xl bg-white">
      <Stage
        className="cursor-pointer"
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
        x={dimensions.x}
        y={dimensions.y}
        draggable
        onWheel={handleWheel}
      >
        <Layer ref={layer}>
          <DrawMindMap data={data} root={data[1]} depth={data[1].depth} />
        </Layer>
      </Stage>
      <ToolMenu dimensions={dimensions} zoomIn={zoomIn} zoomOut={zoomOut} />
      <div className="absolute right-0 top-[-50px] flex gap-3">
        <Button className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold" onClick={handleReArrange}>
          캔버스 재정렬
        </Button>
        <Button className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold">캔버스 비우기</Button>
      </div>
    </div>
  );
}

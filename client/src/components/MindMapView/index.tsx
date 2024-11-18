import useDimension from "@/konva_mindmap/hooks/useDimension";
import useWindowKeyEventListener from "@/hooks/useWindowKeyEventListener";
import DrawMindMap from "@/konva_mindmap/components/DrawMindMap";
import ToolMenu from "@/components/MindMapView/ToolMenu";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";
import { Layer, Stage } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useCollisionDetection } from "@/konva_mindmap/hooks/useCollisionDetection";
import { useEffect, useRef } from "react";
import { useStageStore } from "@/store/useStageStore";
import NoNodeInform from "@/components/MindMapView/NoNodeInform";
import CanvasButtons from "@/components/MindMapView/CanvasButtons";

export default function MindMapView() {
  const { data, undoData: undo, redoData: redo, updateNode, overrideNodeData, saveHistory } = useNodeListContext();
  const { dimensions, targetRef, handleWheel, zoomIn, zoomOut } = useDimension(data);
  const registerLayer = useCollisionDetection(data, updateNode);
  const stageRef = useRef();
  const { registerStageRef } = useStageStore();

  useEffect(() => {
    registerStageRef(stageRef);
  }, [stageRef]);

  const commandKeyMap = {
    z: undo,
    y: redo,
  };
  function handleReArrange() {
    const savedData = JSON.stringify(data);
    saveHistory(savedData);
    overrideNodeData(initializeNodePosition(JSON.parse(savedData)));
  }

  useWindowKeyEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      commandKeyMap[e.key]();
    }
  });

  return (
    <div ref={targetRef} className="relative h-full min-h-0 w-full min-w-0 rounded-xl bg-white">
      <Stage
        ref={stageRef}
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
        <Layer ref={registerLayer}>
          {Object.keys(data).length >= 1 && <DrawMindMap data={data} root={data[1]} depth={1} />}
        </Layer>
      </Stage>
      <ToolMenu dimensions={dimensions} zoomIn={zoomIn} zoomOut={zoomOut} />
      {!Object.keys(data).length ? <NoNodeInform /> : <CanvasButtons handleReArrange={handleReArrange} />}
    </div>
  );
}

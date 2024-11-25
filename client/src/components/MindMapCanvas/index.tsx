import useDimension from "@/konva_mindmap/hooks/useDimension";
import useWindowKeyEventListener from "@/hooks/useWindowKeyEventListener";
import ToolMenu from "@/components/MindMapCanvas/ToolMenu";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";
import { Layer, Stage } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useCollisionDetection } from "@/konva_mindmap/hooks/useCollisionDetection";
import { useEffect, useRef, useState } from "react";
import { useStageStore } from "@/store/useStageStore";
import NoNodeInform from "@/components/MindMapCanvas/NoNodeInform";
import CanvasButtons from "@/components/MindMapCanvas/CanvasButtons";
import MindMapNode from "@/konva_mindmap/components/MindMapNode";
import Konva from "konva";
import SelectionRect from "@/konva_mindmap/components/selectionRect";
import DrawMindMap from "@/konva_mindmap/components/DrawMindMap";
import { findRootNodeKey } from "@/konva_mindmap/utils/findRootNodeKey";

export default function MindMapCanvas({ showMinutes, handleShowMinutes }) {
  const {
    data,
    undoData: undo,
    redoData: redo,
    updateNode,
    overrideNodeData,
    saveHistory,
    loading,
  } = useNodeListContext();
  const { dimensions, targetRef, handleWheel, zoomIn, zoomOut } = useDimension(data);
  const { registerStageRef } = useStageStore();
  const registerLayer = useCollisionDetection(data, updateNode);
  const stageRef = useRef<Konva.Stage>(null);
  const [isDragMode, setDragMode] = useState(false);

  const rootKey = findRootNodeKey(data);

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
      commandKeyMap[e.key]?.();
    }
    if (e.code === "Space") {
      setDragMode(true);
    }
  });

  useWindowKeyEventListener("keyup", (e) => {
    if (e.code === "Space") {
      setDragMode(false);
    }
  });

  return (
    <div ref={targetRef} className="relative h-full min-h-0 w-full min-w-0 rounded-[20px] bg-white">
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
        x={dimensions.x}
        y={dimensions.y}
        onWheel={handleWheel}
        draggable={isDragMode}
        className={`${isDragMode ? "cursor-pointer" : ""}`}
      >
        <Layer ref={registerLayer}>
          {Object.keys(data).length >= 1 && (
            <MindMapNode data={data} node={data[rootKey]} depth={1} dragmode={isDragMode} />
          )}
          <SelectionRect stage={stageRef} dragmode={isDragMode} />
        </Layer>
      </Stage>
      <ToolMenu
        dimensions={dimensions}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        dragmode={isDragMode}
        setDragmode={setDragMode}
      />
      {!Object.keys(data).length && !loading ? (
        <NoNodeInform />
      ) : (
        <CanvasButtons
          handleReArrange={handleReArrange}
          showMinutes={showMinutes}
          handleShowMinutes={handleShowMinutes}
        />
      )}
    </div>
  );
}

import useDimension from "@/konva_mindmap/hooks/useDimension";
import useWindowEventListener from "@/hooks/useWindowEventListener";
import ToolMenu from "@/components/MindMapCanvas/ToolMenu";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";
import { Layer, Stage } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useCollisionDetection } from "@/konva_mindmap/hooks/useCollisionDetection";
import { useEffect, useRef, useState } from "react";
import { useStageStore } from "@/store/useStageStore";
import NoNodeInform from "@/components/MindMapCanvas/NoNodeInform";
import CanvasButtons from "@/components/MindMapCanvas/CanvasButtons";
import SelectionRect from "@/konva_mindmap/components/selectionRect";
import DrawMindMap from "@/konva_mindmap/components/DrawMindMap";
import ShowShortCut from "./ShowShortCut";
import { findRootNodeKey } from "@/konva_mindmap/utils/findRootNodeKey";
import { useConnectionStore } from "@/store/useConnectionStore";
import Konva from "konva";
import { addNode } from "@/konva_mindmap/events/addNode";

export default function MindMapCanvas({ showMinutes, handleShowMinutes }) {
  const {
    data,
    undoData: undo,
    redoData: redo,
    updateNode,
    overrideNodeData,
    saveHistory,
    loading,
    deleteSelectedNodes,
    selectedNode,
    selectNode,
  } = useNodeListContext();
  const [isDragMode, setDragMode] = useState(false);
  const { dimensions, targetRef, handleWheel, zoomIn, zoomOut, reArrange } = useDimension(data);
  const registerLayer = useCollisionDetection(data, updateNode);
  const stageRef = useRef<Konva.Stage>();
  const { registerStageRef } = useStageStore();
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);

  const rootKey = findRootNodeKey(data);

  useEffect(() => {
    registerStageRef(stageRef);
  }, [stageRef]);

  function handleReArrange() {
    handleSocketEvent({
      actionType: "updateNode",
      payload: initializeNodePosition(data),
      callback: (response) => {
        if (response) {
          saveHistory(JSON.stringify(data));
          overrideNodeData(response);
        }
      },
    });
  }

  useWindowEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.metaKey || e.ctrlKey) {
      if (e.shiftKey && e.code) redo();
      switch (e.code) {
        case "KeyZ":
          undo();
          break;
        case "KeyR":
          const url = window.location;
          location.href = url.pathname + url.search;
          break;
      }
    }

    switch (e.code) {
      case "Space":
        setDragMode(true);
        break;
      case "Backspace":
        deleteSelectedNodes();
        break;
      case "Equal":
        addNode(data, selectedNode, overrideNodeData, (newNodeId) => {
          selectNode({
            nodeId: newNodeId,
            parentNodeId: selectedNode.nodeId,
            addTo: "canvas",
          });
        });
        break;
      default:
        break;
    }
  });

  useWindowEventListener("keyup", (e) => {
    if (e.code === "Space") {
      setDragMode(false);
    }
  });

  return (
    <div ref={targetRef} className="relative h-full min-h-0 w-full min-w-0 rounded-[20px] bg-white">
      <Stage
        style={{ overflow: "hidden" }}
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
            <DrawMindMap data={data} root={data[rootKey]} depth={1} dragmode={isDragMode} />
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
      <ShowShortCut />
      {!Object.keys(data).length && !loading ? (
        <NoNodeInform />
      ) : (
        <CanvasButtons
          handleReArrange={handleReArrange}
          handleCenterMove={reArrange}
          showMinutes={showMinutes}
          handleShowMinutes={handleShowMinutes}
        />
      )}
    </div>
  );
}

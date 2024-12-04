import useDimension from "@/konva_mindmap/hooks/useDimension";
import useWindowEventListener from "@/hooks/useWindowEventListener";
import ToolMenu from "@/components/MindMapCanvas/ToolMenu";
import initializeNodePosition from "@/konva_mindmap/utils/initializeNodePosition";
import { Layer, Stage } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useCollisionDetection } from "@/konva_mindmap/hooks/useCollisionDetection";
import { useState } from "react";
import NoNodeInform from "@/components/MindMapCanvas/NoNodeInform";
import CanvasButtons from "@/components/MindMapCanvas/CanvasButtons";
import SelectionRect from "@/konva_mindmap/components/selectionRect";
import DrawMindMap from "@/konva_mindmap/components/DrawMindMap";
import ShowShortCut from "./ShowShortCut";
import { findRootNodeKey } from "@/konva_mindmap/utils/findRootNodeKey";
import { addNode } from "@/konva_mindmap/events/addNode";
import { useConnectionStore } from "@/store/useConnectionStore";
import { moveToNextNode, moveToPreviousNode } from "@/konva_mindmap/utils/moveToNode";

export default function MindMapCanvas({ showMinutes, handleShowMinutes }) {
  const {
    data,
    undoData: undo,
    redoData: redo,
    updateNode,
    overrideNodeData,
    loadingStatus,
    deleteSelectedNodes,
    selectedNode,
    selectNode,
    groupRelease,
    stage,
  } = useNodeListContext();
  const [isDragMode, setDragMode] = useState(false);
  const { dimensions, targetRef, handleWheel, zoomIn, zoomOut, reArrange } = useDimension(data);
  const registerLayer = useCollisionDetection(data, updateNode);
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);

  const rootKey = findRootNodeKey(data);

  function handleReArrange() {
    handleSocketEvent({
      actionType: "updateNode",
      payload: initializeNodePosition(data),
      callback: (response) => {
        if (response) {
          overrideNodeData(response);
        }
      },
    });
  }

  useWindowEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.metaKey || e.ctrlKey) {
      if (e.shiftKey && e.code === "KeyZ") redo();
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
          });
        });
        break;
      case "Escape":
        groupRelease();
        selectNode({});
        break;
      case "Tab":
        if (e.shiftKey) {
          moveToPreviousNode(data, selectedNode, selectNode);
        } else {
          moveToNextNode(data, selectedNode, selectNode);
        }
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
        ref={stage}
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
            <DrawMindMap data={data} root={data[rootKey]} depth={1} dragmode={isDragMode} scale={dimensions.scale} />
          )}
          <SelectionRect stage={stage} dragmode={isDragMode} />
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
      {!Object.keys(data).length && !loadingStatus.socketLoading ? (
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

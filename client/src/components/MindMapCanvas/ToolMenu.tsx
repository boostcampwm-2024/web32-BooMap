import { Button } from "@headlessui/react";
import { useNodeListContext } from "@/store/NodeListProvider";
import { StageDimension } from "@/konva_mindmap/types/dimension";
import { addNode } from "@/konva_mindmap/events/addNode";
import { deleteNodes } from "@/konva_mindmap/events/deleteNode";
import { useRef } from "react";
import { FaRegHandPaper } from "react-icons/fa";
import { PiCursorFill } from "react-icons/pi";
import { TiZoomInOutline } from "react-icons/ti";
import { TiZoomOutOutline } from "react-icons/ti";
import { FaRegTrashAlt } from "react-icons/fa";
import { TbCirclePlus2 } from "react-icons/tb";

type ToolMenuProps = {
  dimensions: StageDimension;
  zoomIn: () => void;
  zoomOut: () => void;
  dragmode: boolean;
  setDragmode: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ToolMenu({ dimensions, zoomIn, zoomOut, dragmode, setDragmode }: ToolMenuProps) {
  const { data, selectNode, selectedNode, saveHistory, overrideNodeData } = useNodeListContext();
  const intervalRef = useRef(null);

  const startZoom = (zoomFn) => {
    intervalRef.current = setInterval(() => {
      zoomFn();
    }, 100);
  };

  const stopZoom = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  function handleAddButton() {
    addNode(data, selectedNode, overrideNodeData, (newNodeId) => {
      selectNode({
        nodeId: newNodeId,
        parentNodeId: selectedNode.nodeId,
      });
    });
  }
  function handleDeleteButton() {
    deleteNodes(JSON.stringify(data), selectedNode.nodeId, overrideNodeData);
    selectNode({ nodeId: 0, parentNodeId: 0 });
  }

  return (
    <div className="absolute bottom-2 left-1/2 flex -translate-x-2/4 -translate-y-2/4 items-center justify-center rounded-full border bg-white px-6 py-2 shadow-md">
      <div className="flex items-center gap-3">
        <Button
          className={`group flex h-8 w-8 items-center justify-center rounded-md p-1 hover:bg-blue-300 ${dragmode ? "bg-blue-400" : ""}`}
          onClick={() => setDragmode(true)}
        >
          <FaRegHandPaper
            className={`mr-[2px] h-[18px] w-[18px] group-hover:fill-gray-100 ${dragmode ? "fill-grayscale-100" : "fill-grayscale-400"}`}
          />
        </Button>
        <Button
          className={`group flex h-8 w-8 items-center justify-center rounded-md p-1 ${dragmode ? "hover:bg-blue-300" : "bg-blue-400"}`}
          onClick={() => setDragmode(false)}
        >
          <PiCursorFill
            className={`h-5 w-5 hover:fill-grayscale-100 ${dragmode ? "fill-gray-400" : "fill-grayscale-100"}`}
          />
        </Button>
        <div className="flex items-center gap-3 border-x-2 px-3">
          <Button
            className="group flex h-8 w-8 items-center justify-center rounded-md p-1 hover:bg-blue-300"
            onMouseDown={() => startZoom(zoomIn)}
            onClick={zoomIn}
            onMouseUp={stopZoom}
            onMouseLeave={stopZoom}
          >
            <TiZoomInOutline className="h-6 w-6 fill-grayscale-400 group-hover:fill-gray-100" />
          </Button>
          <span className="w-8 text-center text-sm font-bold text-black">{Math.floor(dimensions.scale * 100)}%</span>
          <Button
            className="group flex h-8 w-8 items-center justify-center rounded-md p-1 hover:bg-blue-300"
            onMouseDown={() => startZoom(zoomOut)}
            onClick={zoomOut}
            onMouseUp={stopZoom}
            onMouseLeave={stopZoom}
          >
            <TiZoomOutOutline className="h-6 w-6 fill-grayscale-400 group-hover:fill-gray-100" />
          </Button>
        </div>
        <Button
          className="group flex h-8 w-8 items-center justify-center rounded-md fill-gray-100 p-1 hover:bg-blue-300"
          onClick={handleAddButton}
        >
          <TbCirclePlus2 className="h-5 w-5 stroke-grayscale-400 group-hover:fill-blue-300 group-hover:stroke-gray-100" />
        </Button>
        <Button
          className="group flex h-8 w-8 items-center justify-center rounded-md p-1 hover:bg-blue-300"
          onClick={handleDeleteButton}
        >
          <FaRegTrashAlt className="h-[18px] w-[18px] fill-grayscale-400 group-hover:fill-gray-100" />
        </Button>
      </div>
    </div>
  );
}

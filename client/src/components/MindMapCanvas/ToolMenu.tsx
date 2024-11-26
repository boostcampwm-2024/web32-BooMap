import plusIcon from "@/assets/plus.png";
import minusIcon from "@/assets/minus.png";
import addElementIcon from "@/assets/addElement.png";
import deleteIcon from "@/assets/trash.png";
import { Button } from "@headlessui/react";
import { useNodeListContext } from "@/store/NodeListProvider";
import { StageDimension } from "@/konva_mindmap/types/dimension";
import { showNewNode } from "@/konva_mindmap/events/addNode";
import { deleteNode } from "@/konva_mindmap/events/deleteNode";
import { useRef } from "react";

type ToolMenuProps = {
  dimensions: StageDimension;
  zoomIn: () => void;
  zoomOut: () => void;
};
export default function ToolMenu({ dimensions, zoomIn, zoomOut }: ToolMenuProps) {
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
    saveHistory(JSON.stringify(data));
    showNewNode(data, selectedNode, overrideNodeData);
  }
  function handleDeleteButton() {
    saveHistory(JSON.stringify(data));
    deleteNode(JSON.stringify(data), selectedNode.nodeId, overrideNodeData);
    selectNode({ nodeId: 0, parentNodeId: 0 });
  }

  return (
    <div className="absolute bottom-2 left-1/2 flex -translate-x-2/4 -translate-y-2/4 items-center gap-3 rounded-full border bg-white px-10 py-2 shadow-md">
      <div className="flex items-center gap-3 border-r-2 px-5">
        <Button className="h-5 w-5" onMouseDown={() => startZoom(zoomIn)} onMouseUp={stopZoom} onMouseLeave={stopZoom}>
          <img src={plusIcon} alt="확대하기" />
        </Button>
        <span className="w-8 text-center text-sm font-bold text-black">{Math.floor(dimensions.scale * 100)}%</span>
        <Button className="h-5 w-5" onMouseDown={() => startZoom(zoomOut)} onMouseUp={stopZoom} onMouseLeave={stopZoom}>
          <img src={minusIcon} alt="축소하기" />
        </Button>
      </div>
      <Button className="w-8 border-r-2 pr-2" onClick={handleAddButton}>
        <img src={addElementIcon} alt="요소 추가" />
      </Button>
      <Button className="h-5 w-5" onClick={handleDeleteButton}>
        <img src={deleteIcon} alt="요소 삭제" />
      </Button>
    </div>
  );
}

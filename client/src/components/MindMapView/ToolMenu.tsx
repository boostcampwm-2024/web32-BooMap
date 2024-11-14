import plusIcon from "@/assets/plus.png";
import minusIcon from "@/assets/minus.png";
import addElementIcon from "@/assets/addElement.png";
import deleteIcon from "@/assets/trash.png";
import { Button } from "@headlessui/react";
import { useNodeListContext } from "@/store/NodeListProvider";
import { StageDimension } from "@/konva_mindmap/types/dimension";
import { addNode } from "@/konva_mindmap/events/addNode";
import { deleteNode } from "@/konva_mindmap/events/deleteNode";

type ToolMenuProps = {
  dimensions: StageDimension;
};
export default function ToolMenu({ dimensions }: ToolMenuProps) {
  const { data, selectNode, selectedNode, saveHistory, overrideNodeData } = useNodeListContext();

  return (
    <div className="absolute bottom-2 left-1/2 flex -translate-x-2/4 -translate-y-2/4 items-center gap-3 rounded-full border bg-white px-10 py-2 shadow-md">
      <div className="flex items-center gap-3 border-r-2 px-5">
        <Button className="h-5 w-5">
          <img src={plusIcon} alt="확대하기" />
        </Button>
        <span className="w-8 text-center text-sm font-bold text-black">{Math.floor(dimensions.scale * 100)}%</span>
        <Button className="h-5 w-5">
          <img src={minusIcon} alt="축소하기" />
        </Button>
      </div>
      <Button className="w-8 border-r-2 pr-2">
        <img
          src={addElementIcon}
          alt="요소 추가"
          onClick={() => {
            saveHistory(JSON.stringify(data));
            addNode(data, selectedNode, overrideNodeData);
          }}
        />
      </Button>
      <Button className="h-5 w-5">
        <img
          src={deleteIcon}
          alt="요소 삭제"
          onClick={() => {
            console.log("히스토리 저장", data);
            saveHistory(JSON.stringify(data));
            deleteNode(JSON.stringify(data), selectedNode.nodeId, overrideNodeData);
            selectNode({ nodeId: 0, parentNodeId: 0 });
          }}
        />
      </Button>
    </div>
  );
}

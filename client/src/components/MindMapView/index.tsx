import { Button } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import plusIcon from "@/assets/plus.png";
import minusIcon from "@/assets/minus.png";
import addElementIcon from "@/assets/addElement.png";
import deleteIcon from "@/assets/trash.png";
import { useNodeListContext } from "@/store/NodeListProvider";
import useWindowKeyEventListener from "@/hooks/useWindowKeyEventListener";
import { DrawNodefromData } from "@/konva_mindmap/node";
import { Node, NodeData } from "@/types/Node";

export default function MindMapView() {
  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    scale: 1,
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });
  
  const { data, updateNodeList, updateNodeData, undo, redo } = useNodeListContext();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const keyMap = {
    'z': undo,
    'y': redo
  }

  const handleNodeClick = (e: any) => {
    const selectedNodeId = Number(e.target.id());
    setSelectedNode(selectedNodeId);
  };

  const handleNodeDeleteRequest = () => {
    if (selectedNode) {
      setSelectedNode(null);
      const newData = deleteNode({ ...data }, selectedNode);
      updateNodeData(newData);
    }
  };

  useWindowKeyEventListener("keydown", (e) => {
    if (e.ctrlKey && keyMap[e.key]) {
      keyMap[e.key]();
    }
  });

  const deleteNode = (nodeData: NodeData, nodeId: number) => {
    if (!nodeData[nodeId]) return;
    const { children } = nodeData[nodeId];
    children.forEach((childId) => {
      deleteNode(nodeData, childId);
    });
    Object.values(nodeData).forEach((node: Node) => {
      node.children = node.children.filter((childId) => childId !== nodeId);
    })
    delete nodeData[nodeId];
    return nodeData;
  }

  function resizing() {
    if (divRef.current) {
      setDimensions((prevDimensions) => ({
        ...prevDimensions,
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      }));
    }
  }

  useEffect(() => {
    resizing();
    const resizeObserver = new ResizeObserver(() => {
      resizing();
    });

    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [divRef]);

  return (
    //TODO : 캔버스 사이즈에 따라 확장
    <div ref={divRef} className="relative h-full min-h-0 w-full min-w-0 rounded-xl bg-white">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
        x={dimensions.x}
        y={dimensions.y}
      >
        <Layer>{DrawNodefromData({ data: data, root: data[0], depth: data[0].depth, update: updateNodeList, })}</Layer>
      </Stage>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-2/4 -translate-y-2/4 items-center gap-3 rounded-full border px-10 py-2 shadow-md">
        <div className="flex items-center gap-3 border-r-2 px-5">
          <Button className="h-5 w-5">
            <img src={plusIcon} alt="확대하기" />
          </Button>
          <span className="text-sm font-bold text-black">{dimensions.scale * 100}%</span>
          <Button className="h-5 w-5">
            <img src={minusIcon} alt="축소하기" />
          </Button>
        </div>
        <Button className="w-8 border-r-2 pr-2">
          <img src={addElementIcon} alt="요소 추가" />
        </Button>
        <Button className="h-5 w-5" onClick={handleNodeDeleteRequest}>
          <img src={deleteIcon} alt="요소 삭제" />
        </Button>
      </div>
      <Button className="absolute right-0 top-[-50px] rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold">
        캔버스 비우기
      </Button>
    </div>
  );
}

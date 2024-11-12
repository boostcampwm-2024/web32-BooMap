import { Button } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import plusIcon from "@/assets/plus.png";
import minusIcon from "@/assets/minus.png";
import addElementIcon from "@/assets/addElement.png";
import deleteIcon from "@/assets/trash.png";
import { useNodeListContext } from "@/store/NodeListProvider";
import { DrawNodefromData } from "@/konva_mindmap/node";
import { checkCollision } from "@/konva_mindmap/utils/collision";
import useWindowKeyEventListener from "@/hooks/useWindowKeyEventListener";
import { Node, NodeData } from "@/types/Node";
import useLayerEvent from "@/konva_mindmap/hooks/useLayerEvent";
import { ratioSizing } from "@/konva_mindmap/events/ratioSizing";

export default function MindMapView() {
  const { data, updateNodeList, updateNodeData, undo, redo } = useNodeListContext();
  const divRef = useRef<HTMLDivElement>(null);
  const layer = useLayerEvent([["dragmove", () => checkCollision(layer, updateNodeList)]]);
  const [dimensions, setDimensions] = useState({
    scale: 1,
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const keyMap = {
    z: undo,
    y: redo,
  };

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
    });
    delete nodeData[nodeId];
    return nodeData;
  };

  function resizing() {
    if (divRef.current) {
      const newWidth = divRef.current.offsetWidth;
      const newHeight = divRef.current.offsetHeight;

      const centerX = newWidth / 2;
      const centerY = newHeight / 2;
      setDimensions((prevDimensions) => ({
        ...prevDimensions,
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
        x: centerX,
        y: centerY,
      }));
    }
  }

  //그림이 그려지는 영역 크기 계산
  const calculateBounds = (data: NodeData, rootId: number) => {
    const stack = [data[rootId]];
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    while (stack.length > 0) {
      const node = stack.pop();
      if (!node || node.location.x === null || node.location.y === null) continue;

      minX = Math.min(minX, node.location.x);
      minY = Math.min(minY, node.location.y);
      maxX = Math.max(maxX, node.location.x);
      maxY = Math.max(maxY, node.location.y);

      node.children?.forEach((childId) => stack.push(data[childId]));
    }

    return { minX, minY, maxX, maxY };
  };

  //그림 영역에 따른 canvas 크기 조정
  const adjustStageToFit = (
    bounds: { minX: number; minY: number; maxX: number; maxY: number },
    containerWidth: number,
    containerHeight: number,
  ) => {
    const width = bounds.maxX - bounds.minX + 200;
    const height = bounds.maxY - bounds.minY + 200;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;

    const scale = Math.min(scaleX, scaleY);

    const newWidth = divRef.current.offsetWidth;
    const newHeight = divRef.current.offsetHeight;

    const centerX = newWidth / 2;
    const centerY = newHeight / 2;

    return {
      scale,
      x: centerX,
      y: centerY,
    };
  };

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

  useEffect(() => {
    const bounds = calculateBounds(data, 1);
    const { scale, x, y } = adjustStageToFit(bounds, dimensions.width, dimensions.height);
    setDimensions((prev) => ({
      ...prev,
      scale,
      x,
      y,
    }));
  }, [data, dimensions.width, dimensions.height]);

  return (
    <div ref={divRef} className="relative h-full min-h-0 w-full min-w-0 rounded-xl bg-white">
      <Stage
        className="cursor-pointer"
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
        x={dimensions.x}
        y={dimensions.y}
        draggable
        onWheel={(e) => ratioSizing(e, dimensions, setDimensions)}
      >
        <Layer ref={layer}>
          <DrawNodefromData data={data} root={data[1]} depth={data[1].depth} />
        </Layer>
      </Stage>

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
          <img src={addElementIcon} alt="요소 추가" />
        </Button>
        <Button className="h-5 w-5">
          <img src={deleteIcon} alt="요소 삭제" />
        </Button>
      </div>
      <Button className="absolute right-0 top-[-50px] rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold">
        캔버스 비우기
      </Button>
    </div>
  );
}

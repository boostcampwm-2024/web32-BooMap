import { showNewNode } from "@/konva_mindmap/events/addNode";
import { useNodeListContext } from "@/store/NodeListProvider";
import { Button } from "@headlessui/react";

export default function NoNodeInform() {
  const { data, selectedNode, overrideNodeData } = useNodeListContext();
  return (
    <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-30">
      <p className="mb-5 text-white">브레인스토밍을 시작해보세요.</p>
      <Button
        className="rounded-lg bg-bm-blue px-6 py-2"
        onClick={() => showNewNode(data, selectedNode, overrideNodeData)}
      >
        시작하기
      </Button>
    </div>
  );
}

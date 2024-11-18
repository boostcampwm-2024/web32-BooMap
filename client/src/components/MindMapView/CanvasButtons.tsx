import { useNodeListContext } from "@/store/NodeListProvider";
import { Button } from "@headlessui/react";

export default function CanvasButtons({ handleReArrange }) {
  const { overrideNodeData } = useNodeListContext();
  return (
    <div className="absolute right-0 top-[-50px] flex gap-3">
      <Button className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold" onClick={handleReArrange}>
        캔버스 재정렬
      </Button>
      <Button className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold" onClick={() => overrideNodeData({})}>
        캔버스 비우기
      </Button>
    </div>
  );
}

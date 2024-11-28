import DeleteConfirmModal from "@/components/MindMapCanvas/DeleteConfirmModal";
import useModal from "@/hooks/useModal";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useSocketStore } from "@/store/useSocketStore";
import { Button } from "@headlessui/react";
import { createPortal } from "react-dom";

export default function CanvasButtons({ handleReArrange, handleCenterMove, showMinutes, handleShowMinutes }) {
  const { handleSocketEvent } = useSocketStore();
  const { overrideNodeData } = useNodeListContext();
  const { open, openModal, closeModal } = useModal();

  const resetAllNode = () => {
    handleSocketEvent({
      actionType: "updateNode",
      payload: {},
      callback: () => {
        overrideNodeData({});
        closeModal();
      },
    });
  };

  function handleReArrangeAndMoveCenter() {
    handleReArrange();
    handleCenterMove();
  }

  return (
    <div className="absolute right-0 top-[-50px] flex gap-3">
      <Button className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold" onClick={handleShowMinutes}>
        {!showMinutes ? "회의록 보기" : "회의록 닫기"}
      </Button>
      <Button
        className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold"
        onClick={handleReArrangeAndMoveCenter}
      >
        캔버스 재정렬
      </Button>
      <Button className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold" onClick={openModal}>
        캔버스 비우기
      </Button>
      {createPortal(<DeleteConfirmModal open={open} closeModal={closeModal} onConfirm={resetAllNode} />, document.body)}
    </div>
  );
}

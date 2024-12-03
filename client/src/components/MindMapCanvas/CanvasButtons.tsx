import ConfirmResetModal from "@/components/Modal/ConfirmResetModal";
import useModal from "@/hooks/useModal";
import { findRootNodeKey } from "@/konva_mindmap/utils/findRootNodeKey";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useConnectionStore } from "@/store/useConnectionStore";
import { Button } from "@headlessui/react";
import { createPortal } from "react-dom";

export default function CanvasButtons({ handleReArrange, handleCenterMove, showMinutes, handleShowMinutes }) {
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const { data, overrideNodeData } = useNodeListContext();
  const { open, openModal, closeModal } = useModal();
  const rootKey = findRootNodeKey(data);
  const rootData = data[rootKey];

  const resetAllNode = () => {
    handleSocketEvent({
      actionType: "updateNode",
      payload: {
        [rootKey]: { ...rootData, children: [] },
      },
      callback: (response) => {
        overrideNodeData(response);
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
      <Button
        className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold transition hover:brightness-90"
        onClick={handleShowMinutes}
      >
        {!showMinutes ? "회의록 보기" : "회의록 닫기"}
      </Button>
      <Button
        className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold transition hover:brightness-90"
        onClick={handleReArrangeAndMoveCenter}
      >
        캔버스 재정렬
      </Button>
      <Button
        className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold transition hover:brightness-90"
        onClick={openModal}
      >
        캔버스 비우기
      </Button>
      {createPortal(<ConfirmResetModal open={open} closeModal={closeModal} onConfirm={resetAllNode} />, document.body)}
    </div>
  );
}

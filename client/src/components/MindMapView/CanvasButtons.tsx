import DeleteConfirmModal from "@/components/MindMapView/DeleteConfirmModal";
import { useNodeListContext } from "@/store/NodeListProvider";
import { Button } from "@headlessui/react";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function CanvasButtons({ handleReArrange }) {
  const { overrideNodeData } = useNodeListContext();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const resetAllNode = () => {
    overrideNodeData({});
    setShowDeleteConfirmModal(false);
  };
  return (
    <div className="absolute right-0 top-[-50px] flex gap-3">
      <Button className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold" onClick={handleReArrange}>
        캔버스 재정렬
      </Button>
      <Button
        className="rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold"
        onClick={() => setShowDeleteConfirmModal(true)}
      >
        캔버스 비우기
      </Button>
      {showDeleteConfirmModal &&
        createPortal(
          <DeleteConfirmModal
            open={showDeleteConfirmModal}
            closeModal={() => setShowDeleteConfirmModal(false)}
            onConfirm={resetAllNode}
          />,
          document.body,
        )}
    </div>
  );
}

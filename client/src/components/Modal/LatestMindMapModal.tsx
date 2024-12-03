import Modal from "@/components/common/Modal";
import { Button } from "@headlessui/react";

export default function LatestMindMapModal({ open, closeModal, navigateToLatestMindap, navigateToNewMindMap }) {
  return (
    <Modal open={open} closeModal={closeModal}>
      <div className="flex w-full flex-col items-center justify-center gap-5 py-4 text-grayscale-700">
        <p className="font-bold">최근에 작업했던 마인드맵이 있어요!</p>
        <div className="flex w-full flex-col gap-3 text-sm">
          <Button
            className="w-full rounded-md bg-bm-purple p-2.5 text-black transition hover:brightness-90"
            onClick={navigateToLatestMindap}
          >
            작업하던 마인드맵으로 돌아가기
          </Button>
          <Button
            className="w-full rounded-md bg-bm-blue p-2.5 text-grayscale-100 transition hover:brightness-90"
            onClick={navigateToNewMindMap}
          >
            새로운 마인드맵 만들기
          </Button>
        </div>
      </div>
    </Modal>
  );
}

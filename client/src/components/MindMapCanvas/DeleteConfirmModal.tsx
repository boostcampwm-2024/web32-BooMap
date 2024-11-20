import Modal from "@/components/common/Modal";
import { Button } from "@headlessui/react";

type DeleteConfirmModalProps = {
  open: boolean;
  closeModal: () => void;
  onConfirm: () => void;
};
export default function DeleteConfirmModal({ open, closeModal, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Modal open={open} closeModal={closeModal}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <p className="text-black">모든 노드를 초기화할까요?</p>
        <div className="flex w-full gap-4">
          <Button className="w-1/2 rounded-md bg-red-500 py-1" onClick={onConfirm}>
            초기화할게요
          </Button>
          <Button className="w-1/2 rounded-md border border-grayscale-300 py-1 text-black" onClick={closeModal}>
            안할래요
          </Button>
        </div>
      </div>
    </Modal>
  );
}

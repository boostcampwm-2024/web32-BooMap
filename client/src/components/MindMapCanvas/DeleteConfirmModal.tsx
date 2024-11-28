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
      <p className="mb-4 text-lg font-bold text-black">모든 노드를 초기화할까요?</p>
      <div className="flex justify-center gap-2">
        <Button
          onClick={closeModal}
          className="flex-1 rounded-lg bg-grayscale-100 py-2.5 text-center text-sm text-black hover:brightness-90"
        >
          안할래요
        </Button>
        <Button onClick={onConfirm} className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm hover:brightness-90">
          초기화할게요
        </Button>
      </div>
    </Modal>
  );
}

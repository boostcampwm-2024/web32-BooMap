import { Button } from "@headlessui/react";
import Modal from "../common/Modal";

export default function ConfirmUploadModal({ open, closeModal, onConfirm }) {
  return (
    <Modal open={open} closeModal={closeModal}>
      <p className="mb-4 text-lg font-bold text-black">
        AI 기능을 사용하면
        <br />
        마인드맵이 초기화됩니다
      </p>
      <div className="flex justify-center gap-2">
        <Button
          onClick={closeModal}
          className="flex-1 rounded-lg bg-grayscale-100 py-2.5 text-center text-sm text-black transition hover:brightness-90"
        >
          안할래요
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm transition hover:brightness-90"
        >
          초기화할게요
        </Button>
      </div>
    </Modal>
  );
}

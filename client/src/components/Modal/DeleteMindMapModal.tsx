import { Button } from "@headlessui/react";
import Modal from "../common/Modal";

export default function DeleteMindMapModal({ open, closeModal, confirmDelete, data }) {
  return (
    <Modal open={open} closeModal={closeModal}>
      <p className="mb-4 text-center text-lg text-black">
        <span className="font-bold">{data.title}</span>
        <br></br>마인드 맵을 삭제하시겠습니까?
      </p>
      <div className="flex justify-center gap-2">
        <Button
          onClick={closeModal}
          className="flex-1 rounded-lg bg-grayscale-100 py-2.5 text-center text-sm text-black transition hover:brightness-90"
        >
          안할래요
        </Button>
        <Button
          onClick={confirmDelete}
          className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm transition hover:brightness-90"
        >
          삭제할게요
        </Button>
      </div>
    </Modal>
  );
}

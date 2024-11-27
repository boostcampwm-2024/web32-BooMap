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
        <Button onClick={closeModal} className="rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100">
          취소
        </Button>
        <Button onClick={confirmDelete} className="rounded-lg px-4 py-2 text-red-600 hover:bg-red-100">
          삭제
        </Button>
      </div>
    </Modal>
  );
}

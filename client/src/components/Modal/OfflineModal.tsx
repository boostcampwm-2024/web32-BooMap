import Modal from "../common/Modal";

export default function OfflineModal({ open, closeModal }) {
  return (
    <Modal open={open} closeModal={closeModal} optionalStyles="w-auto">
      <div className="flex w-96 flex-col items-center rounded-lg bg-white p-4">
        <p className="mb-2 text-lg font-bold text-black">오프라인 상태입니다</p>
        <p className="text-m text-gray-500">인터넷 연결을 확인해주세요.</p>
        <p className="text-sm font-bold text-red-600">작업 내역이 저장되지 않을 수 있습니다</p>
      </div>
    </Modal>
  );
}

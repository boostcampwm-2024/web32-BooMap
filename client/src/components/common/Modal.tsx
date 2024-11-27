import closeIcon from "@/assets/close.png";

export default function Modal({ open, closeModal, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={closeModal}>
      <div className="relative w-80 rounded-lg bg-white px-10 py-6" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={closeModal} className="absolute right-3 top-3 hover:bg-grayscale-100">
          <img className="h-5 w-5" src={closeIcon} alt="모달 창 닫기 버튼" />
        </button>
      </div>
    </div>
  );
}

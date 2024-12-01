export default function Modal({ open, closeModal, children, optionalStyles = "" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={closeModal}>
      <div
        className={`${optionalStyles ? optionalStyles : ""} relative w-80 rounded-lg bg-white px-10 py-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center hover:bg-grayscale-100"
        >
          <p className="font-black text-grayscale-300">✕</p>
        </button>
      </div>
    </div>
  );
}

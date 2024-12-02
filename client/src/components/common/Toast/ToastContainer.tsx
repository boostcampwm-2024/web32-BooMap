import Toast from "./Toast";

export default function ToastContainer({ toasts, setToasts }) {
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  return (
    <div className="no-scrollbar absolute right-3 top-3 max-h-[calc(100%-50px)] overflow-y-scroll">
      {toasts.toReversed().map((toast) => (
        <Toast key={toast.id} message={toast.message} status={toast.status} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

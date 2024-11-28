import Toast from "./Toast";

export default function ToastContainer({ toasts, setToasts }) {
  const addToast = (message, status) => {
    const id = new Date().getTime();
    setToasts((prevToasts) => [...prevToasts, { id, message, status }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  return (
    <div className="absolute right-0 top-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} status={toast.status} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

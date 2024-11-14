import { useState } from "react";
import Toast from "./Toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

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
      <button onClick={() => addToast("성공적으로 삭제했습니다.", "success")}>Toast(success) 추가</button>
      <button onClick={() => addToast("삭제에 실패하였습니다.", "fail")}>Toast(fail) 추가</button>
    </div>
  );
}

import { useEffect, useState } from "react";
import closeIcon from "@/assets/close.png";

export default function Toast({ message, status, onClose }) {
  const [progress, setProgress] = useState(0);
  const duration = 3000;

  useEffect(() => {
    const interval = duration / 100;
    const timer = setTimeout(onClose, duration);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, interval);
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);
  const textColor = status === "success" ? "text-blue-500" : "text-red-400";
  const bgColor = status === "success" ? "bg-blue-500" : "bg-red-400";

  return (
    <div className={`${textColor} relative mb-2 w-64 bg-grayscale-600 px-4 py-3 text-sm`}>
      <p>{message}</p>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-300">
        <div className={`h-full ${bgColor} transition-all duration-75`} style={{ width: `${progress}%` }}></div>
      </div>
      <button onClick={onClose} className="absolute right-2 top-2">
        <img className="h-4 w-4" src={closeIcon} alt="모달 창 닫기 버튼" />
      </button>
    </div>
  );
}

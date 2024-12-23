import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  status: "success" | "fail" | "error";
  onClose: () => void;
};

export default function Toast({ message, status, onClose }: ToastProps) {
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

  const textColor = {
    success: "text-blue-500",
    fail: "text-red-400",
    error: "text-yellow-500", // error 추가
  }[status];

  const bgColor = {
    success: "bg-blue-500",
    fail: "bg-red-400",
    error: "bg-yellow-500", // error 추가
  }[status];

  return (
    <div className={`${textColor} relative mb-2 w-64 bg-grayscale-600 px-4 py-3 text-sm`}>
      <p>{message}</p>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-300">
        <div className={`h-full ${bgColor} transition-all duration-75`} style={{ width: `${progress}%` }}></div>
      </div>
      <button onClick={onClose} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center">
        <p className="font-black text-grayscale-300">✕</p>
      </button>
    </div>
  );
}

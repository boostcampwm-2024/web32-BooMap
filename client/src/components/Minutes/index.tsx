import { useRef, useState } from "react";
import Tiptap from "./Tiptap";

export default function Minutes({ showMinutes, isAnimating, handleIsAnimating }) {
  const [width, setWidth] = useState(600);
  const startXRef = useRef(0);
  const startWidthRef = useRef(600);

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    handleIsAnimating();
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(startWidthRef.current - (e.clientX - startXRef.current), 500);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  const statusMinutes = showMinutes ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";
  const animation = isAnimating ? "transition-all duration-300 ease-in-out" : "";

  return (
    <>
      <div
        className={`absolute right-[-32px] top-0 z-40 flex h-full max-w-full rounded-bl-[20px] rounded-tl-[20px] bg-grayscale-600 p-5 ${statusMinutes} ${animation}`}
        style={{ width: `${width}px` }}
      >
        <div onMouseDown={handleMouseDown} className="absolute left-0 top-0 h-full w-4 cursor-ew-resize" />
        <div className="flex w-full flex-col">
          <p className="mb-3 text-2xl font-bold">회의록</p>
          <Tiptap />
          <div className="mt-2 flex justify-between">
            <p className="text-grayscale-400">편집은 마인드맵 소유자만 가능해요</p>
          </div>
        </div>
      </div>
    </>
  );
}

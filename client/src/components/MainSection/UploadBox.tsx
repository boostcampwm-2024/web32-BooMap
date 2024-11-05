import { RefAttributes, useRef, useState } from "react";
import voiceIcon from "@/assets/voiceFile.png";
import { Input } from "@headlessui/react";

export default function UploadBox() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      setFile(e.target.files[0]);
    }
  }

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.dataTransfer.files[0]);
    setIsDragging(false);
  };

  return (
    <div
      className={`flex h-full w-full border-spacing-9 cursor-pointer flex-col items-center justify-center gap-8 rounded-xl border-[3px] border-grayscale-300 p-4 text-grayscale-400 ${isDragging ? "bg-grayscale-400" : "border-dotted"}`}
      onClick={handleClick}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
    >
      <Input type="file" ref={fileInputRef} className="hidden h-full w-full" onChange={handleFileChange} />
      <img src={voiceIcon} alt="음성파일" className="h-40 w-32" />
      {file ? file.name : <p>음성 파일을 업로드해주세요(머시기 확장자)</p>}
    </div>
  );
}

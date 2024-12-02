import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FaFileAudio } from "react-icons/fa6";
import { Input } from "@headlessui/react";

type UploadBoxProps = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
};
export default function UploadBox({ file, setFile }: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      const allowedExtensions = ["m4a", "ogg", "aac", "mp3"];

      const fileExtension = e.target.files[0].name.split(".").pop()?.toLowerCase();
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        setFile(e.target.files[0]);
      }
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

  //TODO : 머시기 확장자에서 나중에 정확히 확장자 표기하기
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
      <FaFileAudio size={50} />
      {file ? (
        file.name
      ) : (
        <div>
          <p>음성 파일을 업로드해주세요 </p>
          <p>(m4a, ogg, aac, mp3만 가능)</p>
        </div>
      )}
    </div>
  );
}

import UploadBox from "@/components/MindMapMainSection/ControlSection/UploadBox";
import { Button } from "@headlessui/react";
import { useState } from "react";
import clovaX from "@/assets/clovaX.png";

export default function VoiceFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="flex h-full flex-col gap-6 text-grayscale-100">
      <UploadBox file={file} setFile={setFile} />
      <Button className="rounded-xl bg-bm-blue p-3 transition hover:brightness-90">만들기</Button>
      <div className="flex w-48 justify-end">
        <img src={clovaX} alt="clovaX" />
      </div>
    </div>
  );
}

import UploadBox from "@/components/MindMapMainSection/ControlSection/UploadBox";
import { Button } from "@headlessui/react";
import { useState } from "react";

export default function VoiceFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="flex h-full flex-col gap-12 text-grayscale-100">
      <UploadBox file={file} setFile={setFile} />
      <Button className="rounded-xl bg-bm-blue p-3 transition hover:brightness-90">만들기</Button>
    </div>
  );
}

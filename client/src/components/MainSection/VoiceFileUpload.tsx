import { Button } from "@headlessui/react";
import voiceIcon from "@/assets/voiceFile.png";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import UploadBox from "@/components/MainSection/Uploadbox";

export default function VoiceFileUpload() {
  return (
    <div className="flex h-full flex-col gap-12 text-grayscale-100">
      <UploadBox />
      <Button className="rounded-xl bg-bm-blue p-3">🚀 만들기</Button>
    </div>
  );
}

import { TEXT_UPLOAD_LIMIT } from "@/constants/textUploadLimit";
import { Button, Input, Textarea } from "@headlessui/react";
import { useState } from "react";

export default function TextUpload() {
  const [content, setContent] = useState("");

  return (
    <div className="flex h-full flex-col gap-12 text-grayscale-100">
      <div className="flex h-full flex-col gap-4">
        <p>요약할 텍스트</p>
        <Textarea
          className="h-full w-full resize-none rounded-xl bg-grayscale-600 p-4"
          placeholder="Text를 넣어주세요. (500자 이상 10000자 이하)"
          onChange={(e) => setContent(e.target.value)}
        />
        <p className="text-right text-grayscale-400">
          {content.length}/{TEXT_UPLOAD_LIMIT}
        </p>
      </div>
      <Button className="rounded-xl bg-bm-blue p-3">🚀 만들기</Button>
    </div>
  );
}

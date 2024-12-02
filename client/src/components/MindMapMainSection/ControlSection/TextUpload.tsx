import ArrowBox from "@/components/common/ArrowBox";
import { MAX_TEXT_UPLOAD_LIMIT } from "@/constants/textUploadLimit";
import useUpload from "@/hooks/useUpload";
import { Button, Textarea } from "@headlessui/react";
import clovaX from "@/assets/clovaX.png";
import { useNodeListContext } from "@/store/NodeListProvider";
import UploadAvailabilityArrowBox from "@/components/MindMapMainSection/ControlSection/UploadAvailabilityArrowBox";

export default function TextUpload() {
  const { content, updateContent, handleAiProcessButton, availabilityInform, handleMouseEnter, handleMouseLeave } =
    useUpload();
  const { aiCount } = useNodeListContext();
  return (
    <div className="flex h-full flex-col gap-6 text-grayscale-100">
      <div className="flex h-full flex-col gap-4">
        <p>요약할 텍스트</p>
        <Textarea
          className="h-full w-full resize-none rounded-xl bg-grayscale-600 p-4"
          placeholder="Text를 넣어주세요. (500자 이상 2000자 이하)"
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => updateContent(e.target.value)}
          maxLength={MAX_TEXT_UPLOAD_LIMIT}
        />
        <div className="flex justify-between text-grayscale-400">
          <p>AI 변환 남은 횟수 : {aiCount}번</p>
          <p className="text-right text-grayscale-400">
            {content.length}/{MAX_TEXT_UPLOAD_LIMIT}
          </p>
        </div>
      </div>
      <Button
        className="relative rounded-xl bg-bm-blue p-3 transition hover:brightness-90"
        onClick={handleAiProcessButton}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        만들기
        <UploadAvailabilityArrowBox content={availabilityInform} />
      </Button>
      <div className="flex w-48 justify-end">
        <img src={clovaX} alt="clovaX" />
      </div>
    </div>
  );
}

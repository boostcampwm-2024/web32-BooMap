import ArrowBox from "@/components/common/ArrowBox";
import { MAX_TEXT_UPLOAD_LIMIT } from "@/constants/textUploadLimit";
import useUpload from "@/hooks/useUpload";
import { Button, Textarea } from "@headlessui/react";
import { createPortal } from "react-dom";
import clovaX from "@/assets/clovaX.png";
import AiSpinner from "@/components/common/aiSpinner";

export default function TextUpload() {
  const {
    content,
    aiProcessing,
    buttonAvailability,
    updateContent,
    handleAiProcessButton,
    availabilityInformBox,
    handleMouseEnter,
    handleMouseLeave,
  } = useUpload();

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
        <p className="text-right text-grayscale-400">
          {content.length}/{MAX_TEXT_UPLOAD_LIMIT}
        </p>
      </div>
      <Button
        className="relative rounded-xl bg-bm-blue p-3 transition hover:brightness-90"
        onClick={handleAiProcessButton}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        만들기
        {availabilityInformBox && (
          <ArrowBox
            containerClassName="-left-0.5 -top-10 w-full text-sm"
            boxClassName="bg-grayscale-500 p-1"
            arrowClassName="bottom-0 left-1/2 z-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 bg-grayscale-500"
          >
            <p>마인드맵을 소유한 사람만 ai 변환을 사용할 수 있어요</p>
          </ArrowBox>
        )}
      </Button>
      {aiProcessing && createPortal(<AiSpinner />, document.body)}
      <div className="flex w-48 justify-end">
        <img src={clovaX} alt="clovaX" />
      </div>
    </div>
  );
}

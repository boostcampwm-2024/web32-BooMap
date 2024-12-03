import ArrowBox from "@/components/common/ArrowBox";
import { MAX_TEXT_UPLOAD_LIMIT, MIN_TEXT_UPLOAD_LIMIT } from "@/constants/uploadLimit";
import useUpload from "@/hooks/useUpload";
import { Button, Textarea } from "@headlessui/react";
import { useNodeListContext } from "@/store/NodeListProvider";
import UploadAvailabilityArrowBox from "@/components/MindMapMainSection/ControlSection/UploadAvailabilityArrowBox";
import { useConnectionStore } from "@/store/useConnectionStore";
import useModal from "@/hooks/useModal";
import ConfirmUploadModal from "@/components/Modal/ConfirmUploadModal";
import { createPortal } from "react-dom";

export default function TextUpload() {
  const { content, updateContent, availabilityInform, handleMouseEnter, handleMouseLeave, errorMsg, updateErrorMsg } =
    useUpload();
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const { open, openModal, closeModal } = useModal();

  function textUploadValidation() {
    if (content.length < MIN_TEXT_UPLOAD_LIMIT) {
      updateErrorMsg("텍스트는 500자를 넘어야 합니다.");
      return false;
    }
    return true;
  }

  function handleAiProcessButton() {
    if (availabilityInform) return;
    if (!textUploadValidation()) return;
    updateErrorMsg("");
    handleSocketEvent({ actionType: "aiRequest", payload: { aiContent: content } });
  }

  const { aiCount } = useNodeListContext();

  return (
    <>
      <div className="flex h-full flex-col gap-6 text-grayscale-100">
        <div className="flex h-full flex-col gap-4">
          <p>요약할 텍스트</p>
          <Textarea
            className="h-full w-full resize-none rounded-xl bg-grayscale-600 p-4"
            placeholder="Text를 넣어주세요. (500자 이상 15000자 이하)"
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
        <div className="flex flex-col">
          <Button
            className="relative rounded-xl bg-bm-blue p-3 transition hover:brightness-90"
            onClick={openModal}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            만들기
            <UploadAvailabilityArrowBox content={availabilityInform} />
          </Button>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        </div>
      </div>
      {createPortal(
        <ConfirmUploadModal open={open} closeModal={closeModal} onConfirm={handleAiProcessButton} />,
        document.body,
      )}
    </>
  );
}

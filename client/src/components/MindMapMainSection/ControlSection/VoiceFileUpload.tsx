import UploadBox from "@/components/MindMapMainSection/ControlSection/UploadBox";
import { Button } from "@headlessui/react";
import { useState } from "react";
import clovaX from "@/assets/clovaX.png";
import useUpload from "@/hooks/useUpload";
import UploadAvailabilityArrowBox from "@/components/MindMapMainSection/ControlSection/UploadAvailabilityArrowBox";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useConnectionStore } from "@/store/useConnectionStore";
import { AudioAiConvert } from "@/api/ai.api";
import { useParams } from "react-router-dom";
import { getMindMapByConnectionId } from "@/api/mindmap.api";
import { audioFormData } from "@/utils/formData";
import { FILE_UPLOAD_LIMIT } from "@/constants/uploadLimit";
import { createPortal } from "react-dom";
import useModal from "@/hooks/useModal";
import ConfirmUploadModal from "@/components/Modal/ConfirmUploadModal";

export default function VoiceFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { open, openModal, closeModal } = useModal();
  const { mindMapId: connectionId } = useParams<{ mindMapId: string }>();
  const { availabilityInform, handleMouseEnter, handleMouseLeave, errorMsg, updateErrorMsg } = useUpload();
  const { aiCount, updateLoadingStatus } = useNodeListContext();
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const propagateError = useConnectionStore((state) => state.propagateError);
  const isAuthenticated = useConnectionStore((state) => state.token);
  const [key, setKey] = useState(0);

  function fileValidation(file) {
    if (!file) {
      updateErrorMsg("파일을 선택해주세요.");
      return false;
    }
    if (file.size > FILE_UPLOAD_LIMIT) {
      updateErrorMsg("파일 크기는 100MB를 넘을 수 없습니다.");
      return false;
    }
    return true;
  }

  async function sendAudioFile() {
    closeModal();
    updateErrorMsg("");
    handleSocketEvent({ actionType: "audioAiRequest" });
    try {
      const mindMapId = await getMindMapByConnectionId(connectionId);
      const formData = audioFormData(file, mindMapId, connectionId);
      await AudioAiConvert(formData);
    } catch (error) {
      propagateError("ai 생성에 실패했습니다.", "error");
    } finally {
      updateLoadingStatus({ type: "aiPending", status: false });
      setFile(null);
      setKey((prev) => prev + 1);
    }
  }

  function openConfirmModal() {
    if (availabilityInform) return;
    if (!fileValidation(file)) return;
    openModal();
  }

  return (
    <>
      <div className="flex h-full flex-col text-grayscale-100">
        <UploadBox key={key} file={file} setFile={setFile} />
        {isAuthenticated ? (
          <p className="mb-5 mt-1 text-grayscale-400">AI 변환 남은 횟수 : {aiCount}번</p>
        ) : (
          <p className="mb-5 mt-1 text-grayscale-400">비회원은 AI 변환 기능을 사용할 수 없어요</p>
        )}
        <div className="mb-5 flex w-full flex-col gap-1">
          <Button
            className="rounded-xl bg-bm-blue p-3 transition hover:brightness-90"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={openConfirmModal}
          >
            만들기
            <UploadAvailabilityArrowBox content={availabilityInform} />
          </Button>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        </div>
        <div className="flex w-48 justify-end">
          <img src={clovaX} alt="clovaX" />
        </div>
        {createPortal(
          <ConfirmUploadModal open={open} closeModal={closeModal} onConfirm={sendAudioFile} />,
          document.body,
        )}
      </div>
    </>
  );
}

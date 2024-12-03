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

export default function VoiceFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { mindMapId: connectionId } = useParams<{ mindMapId: string }>();
  const { availabilityInform, handleMouseEnter, handleMouseLeave, errorMsg, updateErrorMsg } = useUpload();
  const { aiCount, updateLoadingStatus } = useNodeListContext();
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const propagateError = useConnectionStore((state) => state.propagateError);

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
    if (!fileValidation(file)) return;
    updateErrorMsg("");
    handleSocketEvent({ actionType: "audioAiRequest" });

    try {
      const mindMapId = await getMindMapByConnectionId(connectionId);
      console.log(mindMapId);
      const formData = audioFormData(file, mindMapId, connectionId);
      await AudioAiConvert(formData);
    } catch (error) {
      propagateError("ai 생성에 실패했습니다.", "error");
    } finally {
      updateLoadingStatus({ type: "aiPending", status: false });
      setFile(null);
    }
  }

  return (
    <div className="flex h-full flex-col text-grayscale-100">
      <UploadBox file={file} setFile={setFile} />
      <p className="mb-5 mt-1 text-grayscale-400">AI 변환 남은 횟수 : {aiCount}번</p>
      <div className="mb-5 flex w-full flex-col gap-1">
        <Button
          className="rounded-xl bg-bm-blue p-3 transition hover:brightness-90"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={sendAudioFile}
        >
          만들기
          <UploadAvailabilityArrowBox content={availabilityInform} />
        </Button>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      </div>
      <div className="flex w-48 justify-end">
        <img src={clovaX} alt="clovaX" />
      </div>
    </div>
  );
}

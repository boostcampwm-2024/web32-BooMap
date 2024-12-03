import UploadBox from "@/components/MindMapMainSection/ControlSection/UploadBox";
import { Button } from "@headlessui/react";
import { useState } from "react";
import clovaX from "@/assets/clovaX.png";
import useUpload from "@/hooks/useUpload";
import UploadAvailabilityArrowBox from "@/components/MindMapMainSection/ControlSection/UploadAvailabilityArrowBox";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useConnectionStore } from "@/store/useConnectionStore";
import { AudioAiConvert } from "@/api/ai";
import { useParams } from "react-router-dom";

export default function VoiceFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { mindMapId: connectionId } = useParams<{ mindMapId: string }>();
  const { availabilityInform, handleMouseEnter, handleMouseLeave } = useUpload();
  const { aiCount } = useNodeListContext();
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);

  async function sendAudioFile() {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    handleSocketEvent({ actionType: "audioAiRequest" });
    const formData = new FormData();
    formData.append("aiAudio", file);
    formData.append("mindmapId", "1");
    formData.append("connectionId", connectionId);
    try {
      await AudioAiConvert(formData);
    } catch (error) {
      console.error("업로드 에러:", error);
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 text-grayscale-100">
      <UploadBox file={file} setFile={setFile} />
      <p className="text-grayscale-400">남은 AI 변환 : {aiCount}</p>
      <Button
        className="rounded-xl bg-bm-blue p-3 transition hover:brightness-90"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={sendAudioFile}
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

import { downloadURI } from "@/konva_mindmap/utils/download";
import { useStageStore } from "@/store/useStageStore";
import { Button } from "@headlessui/react";
import useModal from "@/hooks/useModal";
import ShareModal from "../ShareModal";
import { LuShare, LuShare2 } from "react-icons/lu";
import { createPortal } from "react-dom";

export default function MindMapHeaderButtons() {
  const stage = useStageStore((state) => state.stage);
  const { open, openModal, closeModal } = useModal();

  function handleExport() {
    downloadURI(stage.current.getStage().toDataURL({ mimeType: "image/png", quality: 1 }), "demo");
  }

  return (
    <>
      <div className="flex gap-5">
        <Button
          className="flex items-center gap-3 rounded-lg bg-bm-blue px-5 transition hover:brightness-90"
          onClick={openModal}
        >
          <LuShare2 size={20} />
          공유
        </Button>
        <Button
          className="flex items-center gap-3 rounded-lg bg-grayscale-600 px-5 transition hover:brightness-90"
          onClick={handleExport}
        >
          <LuShare size={20} />
          이미지로 저장
        </Button>
      </div>
      {createPortal(<ShareModal open={open} closeModal={closeModal} />, document.body)}
    </>
  );
}

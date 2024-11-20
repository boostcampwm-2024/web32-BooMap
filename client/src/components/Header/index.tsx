import { Button } from "@headlessui/react";
import profile from "@/assets/profile.png";
import shareIcon from "@/assets/share.png";
import exportIcon from "@/assets/export.png";
import useModal from "@/hooks/useModal";
import LoginModal from "@/components/LoginModal";
import { useStageStore } from "@/store/useStageStore";
import { downloadURI } from "@/konva_mindmap/utils/download";
import { useSearchParams } from "react-router-dom";
import Profile from "@/components/Header/profile";

export default function Header() {
  const mode = useSearchParams();
  const stage = useStageStore((state) => state.stage);
  function handleExport() {
    downloadURI(stage.current.getStage().toDataURL({ mimeType: "image/png", quality: 1 }), "demo");
  }
  return (
    <header className="flex w-full justify-between bg-grayscale-700 p-4">
      <div className="flex gap-5">
        <Button className="flex items-center gap-3 rounded-lg bg-bm-blue px-5 text-grayscale-100">
          <img src={shareIcon} alt="공유하기" className="w-5" />
          Share
        </Button>
        <Button
          className="flex items-center gap-3 rounded-lg bg-grayscale-600 px-5 text-grayscale-100"
          onClick={handleExport}
        >
          <img src={exportIcon} alt="내보내기" className="w-5" />
          Export
        </Button>
      </div>
      <Profile />
    </header>
  );
}

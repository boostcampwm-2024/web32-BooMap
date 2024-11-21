import shareIcon from "@/assets/share.png";
import exportIcon from "@/assets/export.png";
import { downloadURI } from "@/konva_mindmap/utils/download";
import { useStageStore } from "@/store/useStageStore";
import { Button } from "@headlessui/react";

export default function MindMapHeaderButtons() {
  function handleExport() {
    const stage = useStageStore((state) => state.stage);
    downloadURI(stage.current.getStage().toDataURL({ mimeType: "image/png", quality: 1 }), "demo");
  }
  return (
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
  );
}

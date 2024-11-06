import DashBoard from "@/components/Dashboard";
import ControlSection from "@/components/MainSection/ControlSection";
import MindMapView from "@/components/MindMapView";
import useSection from "@/hooks/useSection";
import NodeListProvider from "@/store/NodeListProvider";

export default function MainSection() {
  const mode = useSection().searchParams.get("mode") as keyof typeof modeView;
  const modeView = {
    dashboard: "대시보드",
    voiceupload: "음성 파일 업로드",
    listview: "리스트 보기",
    textupload: "텍스트 형식으로 업로드",
    default: "텍스트 형식으로 업로드",
  };
  return (
    <main className="flex h-full w-full flex-col p-8">
      <NodeListProvider>
        <p className="p-3 text-2xl font-bold">{modeView[mode] || modeView.default}</p>
        <div className="flex h-full w-full gap-4">
          {mode === "dashboard" ? (
            <DashBoard />
          ) : (
            <>
              <ControlSection />
              <MindMapView />
            </>
          )}
        </div>
      </NodeListProvider>
    </main>
  );
}

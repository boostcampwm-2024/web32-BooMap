import DashBoard from "@/components/Dashboard";
import useSection from "@/hooks/useSection";
import MindMapView from "@/components/MainSection/MindMapView";

const modeView = {
  dashboard: "대시보드",
  voiceupload: "음성 파일 업로드",
  listview: "리스트 보기",
  textupload: "텍스트 형식으로 업로드",
  default: "대시보드",
};

export default function MainSection() {
  const mode = useSection().searchParams.get("mode") as keyof typeof modeView;

  return (
    <main className="flex h-[90%] w-full flex-col overflow-hidden p-8">
      <p className="p-3 text-2xl font-bold">{modeView[mode] || modeView.default}</p>
      <div className="relative flex h-[90%] w-full gap-4">
        {mode === "dashboard" || !mode ? (
          <DashBoard />
        ) : (
          <>
            <MindMapView />
          </>
        )}
      </div>
    </main>
  );
}

import DashBoard from "@/components/Dashboard";
import ControlSection from "@/components/MainSection/ControlSection";
import MindMapView from "@/components/MindMapView";
import useSection from "@/hooks/useSection";
import Minutes from "@/components/Minutes";
import useMinutes from "@/hooks/useMinutes";

const modeView = {
  dashboard: "대시보드",
  voiceupload: "음성 파일 업로드",
  listview: "리스트 보기",
  textupload: "텍스트 형식으로 업로드",
  default: "대시보드",
};

export default function MainSection() {
  const mode = useSection().searchParams.get("mode") as keyof typeof modeView;
  const { showMinutes, handleShowMinutes, isAnimating, handleIsAnimating } = useMinutes();

  return (
    <main className="flex h-[90%] w-full flex-col overflow-hidden p-8">
      <p className="p-3 text-2xl font-bold">{modeView[mode] || modeView.default}</p>
      <div className="relative flex h-[90%] w-full gap-4">
        {mode === "dashboard" || !mode ? (
          <DashBoard />
        ) : (
          <>
            <ControlSection />
            <MindMapView showMinutes={showMinutes} handleShowMinutes={handleShowMinutes} />
            <Minutes showMinutes={showMinutes} isAnimating={isAnimating} handleIsAnimating={handleIsAnimating} />
          </>
        )}
      </div>
    </main>
  );
}

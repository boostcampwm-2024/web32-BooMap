import dashBoardIcon from "@/assets/dashboard.png";
import listIcon from "@/assets/list.png";
import aiIcon from "@/assets/ai.png";
import voiceIcon from "@/assets/voiceFile.png";
import textIcon from "@/assets/textFile.png";
import OverviewButton from "@/components/Sidebar/OverviewButton";
import useSection from "@/hooks/useSection";

export default function Overview() {
  const { getmode, handleViewMode } = useSection();
  return (
    <div className="mt-14 flex flex-col text-base">
      <p className="mb-8 font-medium text-grayscale-500">OVERVIEW</p>
      <div className="flex flex-col gap-2 text-grayscale-400">
        <OverviewButton
          src={dashBoardIcon}
          alt="대시보드"
          text="대시보드"
          active={getmode() === "dashboard"}
          onclick={() => handleViewMode("dashboard")}
        />
        <OverviewButton
          src={listIcon}
          alt="리스트"
          text="리스트로 보기"
          active={getmode() === "listview"}
          onclick={() => handleViewMode("listview")}
        />
        <div className="flex items-center gap-6 rounded-lg p-3">
          <img src={aiIcon} alt="ai변환" className="w-6" />
          AI 변환
        </div>
        <div className="flex flex-col gap-2 pl-5">
          <OverviewButton
            src={voiceIcon}
            alt="음성 파일"
            text="음성 파일 업로드"
            active={getmode() === "voiceupload"}
            onclick={() => handleViewMode("voiceupload")}
          />
          <OverviewButton
            src={textIcon}
            alt="텍스트 파일"
            text="텍스트 파일 업로드"
            active={getmode() === "textupload"}
            onclick={() => handleViewMode("textupload")}
          />
        </div>
      </div>
    </div>
  );
}

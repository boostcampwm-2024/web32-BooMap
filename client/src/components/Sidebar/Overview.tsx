import { Button } from "@headlessui/react";
import dashBoardIcon from "@/assets/dashboard.png";
import listIcon from "@/assets/list.png";
import aiIcon from "@/assets/ai.png";
import voiceIcon from "@/assets/voiceFile.png";
import textIcon from "@/assets/textFile.png";
import OverviewButton from "@/components/Sidebar/OverviewButton";

export default function Overview() {
  return (
    <div className="flex flex-col mt-14 text-lg">
      <p className="text-grayscale-500 pl-8 mb-8 font-medium">OVERVIEW</p>
      <div className="flex flex-col gap-7 text-grayscale-400 px-8">
        <OverviewButton src={dashBoardIcon} alt="대시보드" text="대시보드" />
        <OverviewButton src={listIcon} alt="리스트" text="리스트로 보기" />
        <OverviewButton src={aiIcon} alt="AI" text="AI 변환" />
        <div className="flex flex-col gap-7 pl-10">
          <OverviewButton src={voiceIcon} alt="음성 파일" text="음성 파일 업로드" />
          <OverviewButton src={textIcon} alt="텍스트 파일" text="텍스트 파일 업로드" />
        </div>
      </div>
    </div>
  );
}

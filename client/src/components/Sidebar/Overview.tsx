import dashBoardIcon from "@/assets/dashboard.png";
import listIcon from "@/assets/list.png";
import aiIcon from "@/assets/ai.png";
import voiceIcon from "@/assets/voiceFile.png";
import textIcon from "@/assets/textFile.png";
import OverviewButton from "@/components/Sidebar/OverviewButton";
import useSection from "@/hooks/useSection";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "@/store/useSocketStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getLatestMindMap } from "@/utils/localstorage";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import LatestMindMapModal from "@/components/Sidebar/LatestMindMapModal";
import { useState } from "react";

type ViewMode = "listview" | "voiceupload" | "textupload";
export default function Overview() {
  const navigate = useNavigate();
  const { getmode, handleViewMode } = useSection();
  const { socket, handleConnection } = useSocketStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { open, closeModal, openModal } = useModal();
  const [selectMode, setSelcetMode] = useState<ViewMode>("listview");

  const navigateMindmap = (mode: ViewMode) => {
    if (socket) {
      handleViewMode(mode);
      return;
    }

    const latestMindMap = getLatestMindMap();
    if (!latestMindMap) {
      handleConnection(navigate, mode, isAuthenticated);
    }
    openModal();
  };

  function navigateToLatestMindap() {
    navigate(`/mindmap/${getLatestMindMap()}?mode=${selectMode}`);
    closeModal();
  }
  function navigateToNewMindMap() {
    handleConnection(navigate, "listview", isAuthenticated);
    closeModal();
  }

  return (
    <div className="mt-14 flex flex-col text-base">
      <p className="mb-8 font-medium text-grayscale-500">OVERVIEW</p>
      <div className="flex flex-col gap-2 text-grayscale-400">
        <OverviewButton
          src={dashBoardIcon}
          alt="대시보드"
          text="대시보드"
          active={getmode() === "dashboard"}
          onclick={() => navigate("/")}
        />
        <OverviewButton
          src={listIcon}
          alt="리스트"
          text="리스트로 보기"
          active={getmode() === "listview"}
          onclick={() => {
            setSelcetMode("listview");
            navigateMindmap("listview");
          }}
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
            onclick={() => {
              setSelcetMode("voiceupload");
              navigateMindmap("voiceupload");
            }}
          />
          <OverviewButton
            src={textIcon}
            alt="텍스트 파일"
            text="텍스트 파일 업로드"
            active={getmode() === "textupload"}
            onclick={() => {
              setSelcetMode("textupload");
              navigateMindmap("textupload");
            }}
          />
        </div>
      </div>
      {createPortal(
        <LatestMindMapModal
          open={open}
          closeModal={closeModal}
          navigateToLatestMindap={navigateToLatestMindap}
          navigateToNewMindMap={navigateToNewMindMap}
        />,
        document.body,
      )}
    </div>
  );
}

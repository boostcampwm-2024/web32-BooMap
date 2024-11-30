import aiIcon from "@/assets/ai.png";
import OverviewButton from "@/components/Sidebar/OverviewButton";
import useSection from "@/hooks/useSection";
import { useNavigate } from "react-router-dom";
import { getLatestMindMap } from "@/utils/localstorage";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import LatestMindMapModal from "@/components/Sidebar/LatestMindMapModal";
import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaListUl } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaFileAudio } from "react-icons/fa6";
import { RiRobot3Line } from "react-icons/ri";
import { useConnectionStore } from "@/store/useConnectionStore";

type ViewMode = "listview" | "voiceupload" | "textupload";
export default function Overview() {
  const navigate = useNavigate();
  const { getmode, handleViewMode } = useSection();
  const socket = useConnectionStore((state) => state.socket);
  const createConnection = useConnectionStore((state) => state.createConnection);
  const isAuthenticated = useConnectionStore((state) => state.isAuthenticated);
  const { open, closeModal, openModal } = useModal();
  const [selectMode, setSelcetMode] = useState<ViewMode>("listview");

  const navigateMindmap = (mode: ViewMode) => {
    if (socket) {
      handleViewMode(mode);
      return;
    }

    const latestMindMap = getLatestMindMap();
    if (!latestMindMap) {
      createConnection(navigate, mode, isAuthenticated);
      return;
    }
    openModal();
  };

  //비회원은 삭제를 안한다
  //setConnection
  function navigateToLatestMindap() {
    navigate(`/mindmap/${getLatestMindMap()}?mode=${selectMode}`);
    closeModal();
  }

  function navigateToNewMindMap() {
    createConnection(navigate, "listview", isAuthenticated);
    closeModal();
  }

  return (
    <div className="mt-14 flex flex-col text-base">
      <p className="mb-8 font-medium text-grayscale-500">OVERVIEW</p>
      <div className="flex flex-col gap-2 text-grayscale-400">
        <OverviewButton text="대시보드" active={getmode() === "dashboard"} onclick={() => navigate("/")}>
          <RxDashboard className="h-5 w-5" />
        </OverviewButton>
        <OverviewButton
          text="리스트로 보기"
          active={getmode() === "listview"}
          onclick={() => {
            setSelcetMode("listview");
            navigateMindmap("listview");
          }}
        >
          <FaListUl className="h-5 w-5" />
        </OverviewButton>
        <div className="ml-[2px] flex items-center gap-6 rounded-lg p-3">
          <RiRobot3Line className="h-6 w-6" />
          AI 변환
        </div>
        <div className="flex flex-col gap-2 pl-5">
          <OverviewButton
            text="음성 파일 업로드"
            active={getmode() === "voiceupload"}
            onclick={() => {
              setSelcetMode("voiceupload");
              navigateMindmap("voiceupload");
            }}
          >
            <FaFileAudio className="h-5 w-5" />
          </OverviewButton>
          <OverviewButton
            text="텍스트 파일 업로드"
            active={getmode() === "textupload"}
            onclick={() => {
              setSelcetMode("textupload");
              navigateMindmap("textupload");
            }}
          >
            <FaFileAlt className="h-5 w-5" />
          </OverviewButton>
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

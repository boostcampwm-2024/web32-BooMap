import dashboardIcon from "@/assets/dashbordIcon.png";
import plusIcon from "@/assets/plus.png";
import useSection from "@/hooks/useSection";
import { useMindmapStore } from "@/store/useMindmapStore";
import { Button } from "@headlessui/react";

export default function GuestDashBoard() {
  const { mindMapId, initializeMindMap, connectSocket } = useMindmapStore();
  const { handleViewMode } = useSection();

  async function handleConnection() {
    try {
      if (!mindMapId) {
        const newmindMapId = await initializeMindMap();
        connectSocket(newmindMapId);
      } else connectSocket(mindMapId);
      handleViewMode("textupload");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-[20px] bg-grayscale-700">
        <p className="whitespace-pre-line text-center text-3xl font-bold">
          마인드맵을 만들고
          <br />
          브레인 스토밍에 활용해보세요
        </p>
        <img className="w-[300px]" src={dashboardIcon} alt="대쉬보드 아이콘" />
        <Button
          className="group flex w-[300px] items-center justify-center gap-3 rounded-[10px] bg-grayscale-600 px-10 py-2 text-grayscale-200 hover:text-white"
          onClick={handleConnection}
        >
          <img className="w-6 group-hover:brightness-0 group-hover:invert" src={plusIcon} alt="추가하기 아이콘" />
          <p className="text-xl text-grayscale-200 group-hover:text-white">새로운 마인드맵 만들기</p>
        </Button>
        <Button className="mt-4 w-[300px] rounded-[10px] bg-grayscale-600 px-24 py-2 text-xl text-grayscale-200 hover:text-white">
          로그인하기
        </Button>
      </div>
    </>
  );
}

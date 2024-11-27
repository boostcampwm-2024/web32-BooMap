import { useAuthStore } from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";
import { Button } from "@headlessui/react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import cloud from "@/assets/dashbordIcon.png";

export default function NoMindMap() {
  const handleConnection = useSocketStore((state) => state.handleConnection);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 rounded-[20px] bg-grayscale-700 px-8 pb-24 pt-8">
      <img className="w-1/2" src={cloud} alt="" />
      <p>현재 만들어둔 마인드맵이 없어요</p>
      <p>새로운 마인드맵을 생성하고 브레인스토밍 해보세요!</p>
      <Button
        className="flex items-center justify-center gap-2 rounded-xl bg-bm-blue px-5 py-3"
        onClick={() => handleConnection(navigate, "textupload", isAuthenticated)}
      >
        <FaPlus className="h-4 w-4" />
        <p>새로운 마인드맵 만들기</p>
      </Button>
    </div>
  );
}

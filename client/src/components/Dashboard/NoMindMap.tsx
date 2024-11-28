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
    <div className="mb-20 flex h-full w-full flex-col items-center justify-center rounded-[20px] bg-grayscale-700 pb-10">
      <p className="whitespace-pre-line text-center text-3xl font-bold">
        현재 만들어둔 마인드맵이 없어요
        <br />
        새로운 마인드맵을 생성하고 브레인스토밍 해보세요!
      </p>
      <img className="w-[300px]" src={cloud} alt="로그인 후 마인드맵 없을 때 아이콘" />
      <Button
        className="group mt-4 flex w-[300px] items-center justify-center gap-3 rounded-[10px] bg-bm-blue px-10 py-2 hover:brightness-90"
        onClick={() => handleConnection(navigate, "textupload", isAuthenticated)}
      >
        새로운 마인드맵 만들기
      </Button>
    </div>
  );
}

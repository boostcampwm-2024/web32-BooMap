import MindMapInfoItem from "./MindMapInfoItem";
import addIcon from "@/assets/whitePlus.png";
import searchIcon from "@/assets/search.png";
import { Button, Input } from "@headlessui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "@/store/useSocketStore";
import { useAuthStore } from "@/store/useAuthStore";
import useDashBoard from "@/api/fetchHooks/useDashBoard";
import NoMindMap from "@/components/Dashboard/NoMindMap";

export default function UserDashBoard() {
  const { data } = useDashBoard();
  const [searchContent, setSearchContent] = useState("");
  const navigate = useNavigate();
  const handleConnection = useSocketStore((state) => state.handleConnection);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  function searchData(content: string) {
    if (!data) return [];
    return data.filter((item) => item.title.includes(content) || item.keyword.some((k) => k.includes(content)));
  }

  const filteredData = searchData(searchContent);

  if (!data.length) return <NoMindMap />;

  return (
    <div className="relative flex h-full w-full flex-col rounded-[20px] bg-grayscale-700 px-8 pb-24 pt-8">
      <header className="flex items-center justify-between px-3 py-2 font-bold">
        <div className="min-w-72 pl-2">제목</div>
        <div className="min-w-60 pl-8">키워드</div>
        <div className="min-w-24 pl-4">소유자</div>
        <div className="min-w-40 pl-1">생성 일자</div>
      </header>
      <div className="no-scrollbar h-[calc(100%-40px)] overflow-y-scroll border-b-[1px] border-t-[1px] border-grayscale-500">
        {filteredData.map((info, i) => (
          <MindMapInfoItem key={i} data={info} index={i} />
        ))}
      </div>
      <div className="absolute bottom-8 right-8">
        <Button
          className="flex items-center justify-center gap-2 rounded-xl bg-bm-blue px-5 py-3 transition hover:brightness-90"
          onClick={() => handleConnection(navigate, "textupload", isAuthenticated)}
        >
          <FaPlus className="h-4 w-4" />
          <p>새로운 마인드맵 만들기</p>
        </Button>
      </div>
      <div className="absolute right-0 top-[-47px] flex items-center gap-2 rounded-2xl bg-grayscale-700 px-4 py-2 text-grayscale-200">
        <Input
          className="w-48 bg-inherit text-xs focus:outline-none"
          onChange={(e) => {
            setSearchContent(e.target.value);
          }}
          placeholder="키워드나 제목을 입력하세요"
        />
        <Button>
          <img className="h-6 w-6" src={searchIcon} alt="검색하기 버튼" />
        </Button>
      </div>
    </div>
  );
}

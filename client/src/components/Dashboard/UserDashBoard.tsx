import MindMapInfoItem from "./MindMapInfoItem";
import { Button, Input } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDashBoard from "@/api/fetchHooks/useDashBoard";
import NoMindMap from "@/components/Dashboard/NoMindMap";
import { useConnectionStore } from "@/store/useConnectionStore";
import { IoSearch } from "react-icons/io5";

export default function UserDashBoard() {
  const { data } = useDashBoard();
  const [searchContent, setSearchContent] = useState("");
  const navigate = useNavigate();
  const createConnection = useConnectionStore((state) => state.createConnection);
  const updateOwnedMindMap = useConnectionStore((state) => state.updateOwnedMindMap);

  useEffect(() => {
    if (data.length) {
      updateOwnedMindMap(data);
    }
  }, [data]);

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
        <div className="w-44 pl-4">소유자</div>
        <div className="min-w-40 pl-4">생성 일자</div>
      </header>
      <div className="no-scrollbar h-[calc(100%-40px)] overflow-y-scroll border-b-[1px] border-t-[1px] border-grayscale-500">
        {filteredData.map((info, i) => (
          <MindMapInfoItem key={`dashboard-${i}`} data={info} index={i} />
        ))}
      </div>
      <div className="absolute bottom-8 right-8">
        <Button
          className="flex items-center justify-center gap-2 rounded-xl bg-bm-blue px-5 py-3 transition hover:brightness-90"
          onClick={() => createConnection(navigate, "textupload")}
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
        <IoSearch size={24} />
      </div>
    </div>
  );
}

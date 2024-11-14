import MindMapInfoItem from "./MindMapInfoItem";
import addIcon from "@/assets/whitePlus.png";
import searchIcon from "@/assets/search.png";
import { Button, Input } from "@headlessui/react";

export default function UserDashBoard() {
  const data = Array(10).fill({
    title: "어쩌구 제목 마인드맵",
    keyword: ["대분류", "중분류", "중분류"],
    owner: { img: "이미지", id: "user1" },
    createdAt: "2024.11.13",
  });

  return (
    <div className="relative flex h-full w-full flex-col rounded-[20px] bg-grayscale-700 px-8 pb-24 pt-8">
      <header className="flex items-center justify-between px-3 py-2 font-bold">
        <div className="min-w-72 pl-2">제목</div>
        <div className="min-w-44 pl-8">키워드</div>
        <div className="min-w-24 pl-4">소유자</div>
        <div className="min-w-40 pl-1">생성 일자</div>
      </header>
      <div className="no-scrollbar h-[calc(100%-40px)] overflow-y-scroll border-b-[1px] border-t-[1px] border-grayscale-500">
        {data.map((v, i) => (
          <MindMapInfoItem key={i} data={v} index={i} />
        ))}
      </div>
      <div className="absolute bottom-8 right-8">
        <Button
          className="flex items-center justify-center gap-2 rounded-xl bg-bm-blue px-5 py-3"
          onClick={() => console.log("마인드 맵 추가")}
        >
          <img className="h-4 w-4" src={addIcon} alt="마인드 맵 추가 버튼" />
          <p>새로운 마인드맵 만들기</p>
        </Button>
      </div>
      <div className="absolute right-0 top-[-47px] flex items-center gap-2 rounded-2xl bg-grayscale-700 px-4 py-2 text-grayscale-200">
        <Input className="w-48 bg-inherit text-xs focus:outline-none" placeholder="키워드나 제목을 입력하세요" />
        <Button onClick={() => console.log("키워드나 제목으로 검색하기")}>
          <img className="h-6 w-6" src={searchIcon} alt="검색하기 버튼" />
        </Button>
      </div>
    </div>
  );
}

import MindMapInfoItem from "./MindMapInfoItem";
import addIcon from "@/assets/whitePlus.png";
import searchIcon from "@/assets/search.png";
import { Button, Input } from "@headlessui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "@/store/useSocketStore";

const apiData = {
  mindMaps: [
    {
      id: 1,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "점심 메뉴를 골라볼까나~?",
      keyword: ["점심메뉴", "한식", "중식", "양식", "일식", "피자", "초밥"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "강민주",
    },
    {
      id: 2,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "이번 주 주말에 뭐할까?",
      keyword: ["주말에 갈 곳", "놀이공원", "더현대 서울", "카페", "쇼핑", "놀이기구"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "양현호",
    },
    {
      id: 3,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "여행",
      keyword: ["여행", "국내", "국외", "부산", "제주도", "여수", "일본", "베트남", "미국"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "조민형",
    },
    {
      id: 4,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "프로젝트 회의",
      keyword: ["회의", "에러 발생!!", "추가 기능", "진행상황공유", "UI 에러..."],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "김남희",
    },
    {
      id: 5,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "점심 메뉴를 골라볼까나~?",
      keyword: ["점심메뉴", "한식", "중식", "양식", "일식", "피자", "초밥"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "강민주",
    },
    {
      id: 6,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "이번 주 주말에 뭐할까?",
      keyword: ["주말에 갈 곳", "놀이공원", "더현대 서울", "카페", "쇼핑", "놀이기구"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "양현호",
    },
    {
      id: 7,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "여행",
      keyword: ["여행", "국내", "국외", "부산", "제주도", "여수", "일본", "베트남", "미국"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "조민형",
    },
    {
      id: 8,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "프로젝트 회의",
      keyword: ["회의", "에러 발생!!", "추가 기능", "진행상황공유", "UI 에러..."],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "김남희",
    },
    {
      id: 9,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "점심 메뉴를 골라볼까나~?",
      keyword: ["점심메뉴", "한식", "중식", "양식", "일식", "피자", "초밥"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "강민주",
    },
    {
      id: 10,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "이번 주 주말에 뭐할까?",
      keyword: ["주말에 갈 곳", "놀이공원", "더현대 서울", "카페", "쇼핑", "놀이기구"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "양현호",
    },
    {
      id: 11,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "여행",
      keyword: ["여행", "국내", "국외", "부산", "제주도", "여수", "일본", "베트남", "미국"],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "조민형",
    },
    {
      id: 12,
      connectionId: "asdf12-asd1f8-asd1f5-asdf",
      title: "프로젝트 회의",
      keyword: ["회의", "에러 발생!!", "추가 기능", "진행상황공유", "UI 에러..."],
      createdDate: new Date(),
      modifiedDate: new Date(),
      owner: "김남희",
    },
  ],
};

export default function UserDashBoard() {
  const [data, setData] = useState(apiData.mindMaps);
  const [searchContent, setSearchContent] = useState("");
  const navigate = useNavigate();
  const handleConnection = useSocketStore((state) => state.handleConnection);
  localStorage.setItem("user", "강민주");

  function handleDeleteData(id: number) {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  }

  function searchData(content: string) {
    const filteredData = data.filter(
      (item) => item.title.includes(content) || item.keyword.some((k) => k.includes(content)),
    );
    return filteredData;
  }

  const filteredData = searchData(searchContent);

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
          <MindMapInfoItem key={i} data={info} index={i} handleDeleteData={handleDeleteData} />
        ))}
      </div>
      <div className="absolute bottom-8 right-8">
        <Button
          className="flex items-center justify-center gap-2 rounded-xl bg-bm-blue px-5 py-3"
          onClick={() => handleConnection(navigate, "textupload")}
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
        <Button onClick={() => searchData(searchContent)}>
          <img className="h-6 w-6" src={searchIcon} alt="검색하기 버튼" />
        </Button>
      </div>
    </div>
  );
}

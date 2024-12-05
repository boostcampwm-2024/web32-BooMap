import MindMapInfoItem from "./MindMapInfoItem";
import { Button, Input } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FaArrowDown, FaPlus, FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDashBoard from "@/api/fetchHooks/useDashBoard";
import NoMindMap from "@/components/Dashboard/NoMindMap";
import { useConnectionStore } from "@/store/useConnectionStore";
import { IoSearch } from "react-icons/io5";

type SortKey = "title" | "ownerName" | "createDate";
type SortOrder = "asc" | "desc";

export default function UserDashBoard() {
  const { data } = useDashBoard();
  const [filteredData, setFilteredData] = useState(data);
  const [sortKey, setSortKey] = useState<SortKey>("createDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const createConnection = useConnectionStore((state) => state.createConnection);
  const updateOwnedMindMap = useConnectionStore((state) => state.updateOwnedMindMap);

  useEffect(() => {
    if (data.length) {
      updateOwnedMindMap(data);
    }
  }, [data]);

  useEffect(() => {
    applyFilters(data, searchQuery);
  }, [sortKey, sortOrder]);

  function searchData(content: string) {
    return data.filter((item) => item.title.includes(content) || item.keyword.some((k) => k.includes(content)));
  }

  function sortData(items, key: SortKey, order: SortOrder) {
    return [...items].sort((a, b) => {
      const valueA = key === "createDate" ? new Date(a[key]).getTime() : a[key];
      const valueB = key === "createDate" ? new Date(b[key]).getTime() : b[key];

      if (order === "asc") return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    });
  }

  function applyFilters(originalData, query: string) {
    let result = query ? searchData(query) : originalData;
    result = sortData(result, sortKey, sortOrder);
    setFilteredData(result);
  }

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    applyFilters(data, query);
  }

  function handleSortChange(key: SortKey, order: SortOrder) {
    setSortKey(key);
    setSortOrder(order);
    applyFilters(data, searchQuery);
  }

  function handleDeleteMindMap(id: number) {
    setFilteredData((prevData) => prevData.filter((item) => item.id !== id));
  }

  if (!data.length) return <NoMindMap />;

  const buttonBaseClass = "flex items-center gap-0.5 text-sm";
  const buttonInactiveClass = "text-grayscale-300 hover:text-white";
  const buttonActiveClass = "text-white";

  return (
    <div className="relative flex h-full w-full flex-col rounded-[20px] bg-grayscale-700 px-8 pb-24 pt-3">
      <div className="mb-2 flex items-center justify-end gap-2">
        <Button
          className={`${buttonBaseClass} ${sortKey === "createDate" && sortOrder === "desc" ? buttonActiveClass : buttonInactiveClass}`}
          onClick={() => handleSortChange("createDate", "desc")}
        >
          최신 순
        </Button>
        <span>|</span>
        <Button
          className={`${buttonBaseClass} ${sortKey === "createDate" && sortOrder === "asc" ? buttonActiveClass : buttonInactiveClass}`}
          onClick={() => handleSortChange("createDate", "asc")}
        >
          오래된 순
        </Button>
        <span>|</span>
        <Button
          className={`${buttonBaseClass} ${sortKey === "title" && sortOrder === "asc" ? buttonActiveClass : buttonInactiveClass}`}
          onClick={() => handleSortChange("title", "asc")}
        >
          제목 순<FaArrowUp />
        </Button>
        <span>|</span>
        <Button
          className={`${buttonBaseClass} ${sortKey === "title" && sortOrder === "desc" ? buttonActiveClass : buttonInactiveClass}`}
          onClick={() => handleSortChange("title", "desc")}
        >
          제목 순<FaArrowDown />
        </Button>
        <span>|</span>
        <Button
          className={`${buttonBaseClass} ${sortKey === "ownerName" && sortOrder === "asc" ? buttonActiveClass : buttonInactiveClass}`}
          onClick={() => handleSortChange("ownerName", "asc")}
        >
          소유자 이름 순<FaArrowUp />
        </Button>
        <span>|</span>
        <Button
          className={`${buttonBaseClass} ${sortKey === "ownerName" && sortOrder === "desc" ? buttonActiveClass : buttonInactiveClass}`}
          onClick={() => handleSortChange("ownerName", "desc")}
        >
          소유자 이름 순<FaArrowDown />
        </Button>
      </div>
      <header className="flex items-center justify-between px-3 py-2 font-bold">
        <div className="min-w-72 pl-2">제목</div>
        <div className="min-w-60 pl-8">키워드</div>
        <div className="w-44 pl-4">소유자</div>
        <div className="min-w-40 pl-4">생성 일자</div>
      </header>
      <div className="no-scrollbar h-[calc(100%-40px)] overflow-y-scroll border-b-[1px] border-t-[1px] border-grayscale-500">
        {filteredData.map((info, i) => (
          <MindMapInfoItem key={`dashboard-${info.id}`} data={info} index={i} onDelete={handleDeleteMindMap} />
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
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="키워드나 제목을 입력하세요"
        />
        <IoSearch size={24} />
      </div>
    </div>
  );
}

import profile from "@/assets/profile.png";
import deleteIcon from "@/assets/trash2.png";
import useModal from "@/hooks/useModal";
import { Button } from "@headlessui/react";
import extractDate from "@/utils/extractDate";
import DeleteMindMapModal from "../DeleteMindMapModal";
import { createPortal } from "react-dom";

interface MindMapInfoItemProps {
  data: {
    id: number;
    connectionId: string;
    title: string;
    keyword: string[];
    createdDate: Date;
    modifiedDate: Date;
    owner: string;
  };
  index: number;
  handleDeleteData: (id: number) => void;
}

export default function MindMapInfoItem({ data, index, handleDeleteData }: MindMapInfoItemProps) {
  const { open, openModal, closeModal } = useModal();

  const keywordData = data.keyword.slice(0, 4);

  const ownerCheck = localStorage.getItem("user") === data.owner;

  const confirmDelete = () => {
    handleDeleteData(data.id);
    closeModal();
  };

  return (
    <>
      <div
        className={`${index !== 0 ? "border-t-[1px] border-t-grayscale-500" : ""} flex items-center justify-between px-3 py-2`}
      >
        <div className="min-w-72">{data.title}</div>
        <div className="grid w-60 grid-cols-2 gap-1 px-5 text-xs">
          {keywordData.map((keyword, i) => (
            <span
              key={i}
              className="overflow-hidden text-ellipsis whitespace-nowrap rounded-2xl bg-bm-purple px-4 py-1 text-center"
            >
              {keyword}
            </span>
          ))}
        </div>
        <div className="flex min-w-24 items-center justify-center gap-2">
          <img className="h-6 w-6" src={profile} alt="소유자 이미지" />
          <div>{data.owner}</div>
        </div>
        <div className="flex min-w-40 justify-between">
          <div>{extractDate(data.createdDate)}</div>
          {ownerCheck ? (
            <Button className="group" onClick={openModal}>
              <img
                className="h-6 w-6 group-hover:brightness-0 group-hover:invert"
                src={deleteIcon}
                alt="마인드 맵 삭제 버튼"
              />
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      {createPortal(
        <DeleteMindMapModal open={open} closeModal={closeModal} confirmDelete={confirmDelete} data={data} />,
        document.body,
      )}
    </>
  );
}

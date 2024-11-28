import profile from "@/assets/profile.png";
import useModal from "@/hooks/useModal";
import { Button } from "@headlessui/react";
import extractDate from "@/utils/extractDate";
import DeleteMindMapModal from "../DeleteMindMapModal";
import { createPortal } from "react-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDeleteMindMap } from "@/api/fetchHooks/useDeleteMindMap";
import { DashBoard } from "@/konva_mindmap/types/dashboard";

interface MindMapInfoItemProps {
  data: DashBoard;
  index: number;
}

export default function MindMapInfoItem({ data, index }: MindMapInfoItemProps) {
  const { open, openModal, closeModal } = useModal();
  const { name } = useAuthStore();
  const keywordData = data.keyword.slice(0, 4);
  const navigate = useNavigate();
  const mutation = useDeleteMindMap({
    mindMapId: data.id.toString(),
    onError: (error) => console.log(error),
  });

  const ownerCheck = name === data.owner;

  function handleDelete() {
    mutation.mutate();
    closeModal();
  }
  function navigateToMindMap() {
    navigate(`/mindmap/${data.connectionId}?mode=listview`);
  }

  return (
    <>
      <div
        className={`${index !== 0 ? "border-t-[1px] border-t-grayscale-500" : ""} flex h-16 cursor-pointer items-center justify-between px-3 py-2`}
        onClick={navigateToMindMap}
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
          <div>{extractDate(new Date(data.createDate))}</div>
          {ownerCheck ? (
            <Button
              className="group"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
            >
              <FaRegTrashAlt className="h-5 w-5 fill-grayscale-500 group-hover:fill-slate-400" />
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      {createPortal(
        <DeleteMindMapModal open={open} closeModal={closeModal} confirmDelete={handleDelete} data={data} />,
        document.body,
      )}
    </>
  );
}

import useModal from "@/hooks/useModal";
import { Button } from "@headlessui/react";
import extractDate from "@/utils/extractDate";
import DeleteMindMapModal from "../Modal/DeleteMindMapModal";
import { createPortal } from "react-dom";
import { FaRegTrashAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDeleteMindMap } from "@/api/fetchHooks/useDeleteMindMap";
import { DashBoard } from "@/konva_mindmap/types/dashboard";
import { useConnectionStore } from "@/store/useConnectionStore";

interface MindMapInfoItemProps {
  data: DashBoard;
  index: number;
  onDelete: (id: number) => void;
}

export default function MindMapInfoItem({ data, index, onDelete }: MindMapInfoItemProps) {
  const { open, openModal, closeModal } = useModal();
  const keywordData = data.keyword.slice(0, 4);
  const navigate = useNavigate();
  const mutation = useDeleteMindMap({
    mindMapId: data.id.toString(),
    onError: (error) => console.log(error),
  });
  const id = useConnectionStore((state) => state.id);
  const getConnection = useConnectionStore((state) => state.getConnection);

  const ownerCheck = id === data.ownerId;

  function handleDelete() {
    mutation.mutate();
    closeModal();
    onDelete(data.id);
  }

  function navigateToMindMap() {
    getConnection(data.id, data.connectionId);
    navigate(`/mindmap/${data.connectionId}?mode=listview`);
  }

  return (
    <>
      <div
        className={`${index !== 0 ? "border-t-[1px] border-t-grayscale-500" : ""} flex h-16 cursor-pointer items-center justify-between px-3 py-2 transition hover:brightness-110`}
        onClick={navigateToMindMap}
      >
        <div className="min-w-72">{data.title}</div>
        <div className="grid w-60 grid-cols-2 gap-1 px-5 text-xs">
          {keywordData.map((keyword, i) => (
            <span
              key={`keyword-${i}`}
              className="overflow-hidden text-ellipsis whitespace-nowrap rounded-2xl bg-bm-purple px-4 py-1 text-center"
            >
              {keyword}
            </span>
          ))}
        </div>
        <div className="flex w-44 items-center gap-2 pl-4">
          <FaUserCircle className="h-6 w-6" />
          <div className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">{data.ownerName}</div>
        </div>
        <div className="flex min-w-40 justify-between pl-4">
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

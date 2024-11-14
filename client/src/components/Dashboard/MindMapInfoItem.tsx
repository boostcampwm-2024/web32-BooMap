import profile from "@/assets/profile.png";
import deleteIcon from "@/assets/trash2.png";
import useModal from "@/hooks/useModal";
import { Button } from "@headlessui/react";
import Modal from "../common/Modal";

export default function MindMapInfoItem({ data, index }) {
  const { open, openModal, closeModal } = useModal();

  const confirmDelete = () => {
    console.log("마인드 맵 삭제 확인");
    closeModal();
  };

  return (
    <>
      <div
        className={`${index !== 0 ? "border-t-[1px] border-t-grayscale-500" : ""} flex items-center justify-between px-3 py-2`}
      >
        <div className="min-w-72">{data.title}</div>
        <div className="grid w-44 grid-cols-2 gap-1 px-5 text-xs">
          {data.keyword.map((v, i) => (
            <span key={i} className="rounded-2xl bg-bm-purple px-4 py-[2px]">
              {v}
            </span>
          ))}
        </div>
        <div className="flex min-w-24 items-center justify-center gap-2">
          <img className="h-6 w-6" src={profile} alt="소유자 이미지" />
          <div>{data.owner.id}</div>
        </div>
        <div className="flex min-w-40 justify-between">
          <div>{data.createdAt}</div>
          <Button className="group" onClick={openModal}>
            <img
              className="h-6 w-6 group-hover:brightness-0 group-hover:invert"
              src={deleteIcon}
              alt="마인드 맵 삭제 버튼"
            />
          </Button>
        </div>
      </div>
      <Modal open={open} closeModal={closeModal}>
        <p className="mb-4 text-center text-lg text-black">
          <span className="font-bold">{"갱"}</span>
          <br></br>마인드 맵을 삭제하시겠습니까?
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={closeModal} className="rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100">
            취소
          </Button>
          <Button onClick={confirmDelete} className="rounded-lg px-4 py-2 text-red-600 hover:bg-red-100">
            삭제
          </Button>
        </div>
      </Modal>
    </>
  );
}

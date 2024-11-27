import Modal from "@/components/common/Modal";
import { Button } from "@headlessui/react";
import { createPortal } from "react-dom";
import warnIcon from "@/assets/warning.png";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "@/store/useSocketStore";

export default function GuestNewMindMapModal({ open, closeModal, openLogin }) {
  const navigate = useNavigate();
  const handleConnection = useSocketStore((state) => state.handleConnection);

  return (
    <>
      {open &&
        createPortal(
          <Modal open={open} closeModal={closeModal}>
            <div className="flex flex-col items-center gap-3">
              <img src={warnIcon} alt="www" className="w-36" />
              <p className="text-center text-sm text-black">
                로그인하지 않은 상태로 마인드맵을 만들면 {"\n"} 24시간 이후에 사라져요
              </p>
              <Button className="w-full rounded-md bg-bm-blue p-2 text-grayscale-100" onClick={openLogin}>
                로그인하고 유지하기
              </Button>
              <Button
                className="w-full rounded-md bg-grayscale-400 p-2"
                onClick={() => handleConnection(navigate, "listview")}
              >
                그냥 할게요
              </Button>
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
}

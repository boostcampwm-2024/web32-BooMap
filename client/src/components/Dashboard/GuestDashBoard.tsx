import dashboardIcon from "@/assets/dashbordIcon.png";
import plusIcon from "@/assets/plus.png";
import GuestNewMindMapModal from "@/components/Modal/GuestNewMindMapModal";
import LoginModal from "@/components/Modal/LoginModal";
import useModal from "@/hooks/useModal";
import { Button } from "@headlessui/react";

export default function GuestDashBoard() {
  const { closeModal: closeLoginModal, open: loginModal, openModal: openLoginModal } = useModal();
  const { closeModal: closeConfirmModal, open: confirmModal, openModal: openConfirmModal } = useModal();

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-[20px] bg-grayscale-700">
        <p className="whitespace-pre-line text-center text-3xl font-bold">
          마인드맵을 만들고
          <br />
          브레인 스토밍에 활용해보세요
        </p>
        <img className="w-[300px]" src={dashboardIcon} alt="대쉬보드 아이콘" />
        <Button
          className="w-[300px] rounded-[10px] bg-grayscale-600 px-24 py-2 transition hover:brightness-90"
          onClick={openLoginModal}
        >
          로그인하기
        </Button>
        <GuestNewMindMapModal
          open={confirmModal}
          closeModal={closeConfirmModal}
          openLogin={() => {
            openLoginModal();
            closeConfirmModal();
          }}
        />
        <Button
          className="group mt-4 flex w-[300px] items-center justify-center gap-3 rounded-[10px] bg-bm-blue px-10 py-2 transition hover:brightness-90"
          onClick={openConfirmModal}
        >
          새로운 마인드맵 만들기
        </Button>
      </div>
      <LoginModal open={loginModal} close={closeLoginModal} />
    </>
  );
}

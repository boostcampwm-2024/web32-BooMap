import { Button } from "@headlessui/react";
import profile from "@/assets/profile.png";
import shareIcon from "@/assets/share.png";
import exportIcon from "@/assets/export.png";
import useModal from "@/hooks/useModal";
import LoginModal from "@/components/LoginModal";

export default function Header() {
  const { open, openModal, closeModal } = useModal();
  return (
    <header className="flex w-full justify-between bg-grayscale-700 p-4">
      <div className="flex gap-5">
        <Button className="flex items-center gap-3 rounded-lg bg-bm-blue px-5 text-grayscale-100">
          <img src={shareIcon} alt="공유하기" className="w-5" />
          Share
        </Button>
        <Button className="flex items-center gap-3 rounded-lg bg-grayscale-600 px-5 text-grayscale-100">
          <img src={exportIcon} alt="내보내기" className="w-5" />
          Export
        </Button>
      </div>
      <div className="flex gap-6">
        <Button className="bg-transparent text-grayscale-100" onClick={openModal}>
          로그인
        </Button>
        <img src={profile} className="h-10 w-10" alt="프로필" />
      </div>
      <LoginModal open={open} close={closeModal} />
    </header>
  );
}

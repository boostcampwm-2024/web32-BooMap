import LoginModal from "@/components/LoginModal";
import profile from "@/assets/profile.png";
import { Button } from "@headlessui/react";
import { createPortal } from "react-dom";
import { useAuthStore } from "@/store/useAuthStore";
import useModal from "@/hooks/useModal";
import ProfileModal from "@/components/MindMapHeader/ProfileModal";

export default function Profile() {
  const { open: loginModal, openModal: openLoginModal, closeModal: closeLoginModal } = useModal();
  const { open: profileModal, openModal: openProfileModal, closeModal: closeProfileModal } = useModal();
  const auth = useAuthStore();
  const handleLoginAndOut = () => {
    if (auth.isAuthenticated) {
      auth.logout();
      return;
    }
    openLoginModal();
  };
  const handleProfileModal = () => {
    if (auth.isAuthenticated) {
      openProfileModal();
      return;
    }
    openLoginModal();
  };
  return (
    <>
      <div className="relative flex items-center gap-6">
        <Button className="bg-transparent text-grayscale-100" onClick={handleLoginAndOut}>
          {auth.isAuthenticated ? "로그아웃" : "로그인"}
        </Button>
        <Button onClick={handleProfileModal}>
          <img src={profile} className="h-10 w-10" alt="프로필" />
        </Button>
        <ProfileModal open={profileModal} close={closeProfileModal} />
      </div>
      {createPortal(<LoginModal open={loginModal} close={closeLoginModal} />, document.body)}
    </>
  );
}

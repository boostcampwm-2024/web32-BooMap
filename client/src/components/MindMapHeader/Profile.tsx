import LoginModal from "@/components/LoginModal";
import profile from "@/assets/profile.png";
import { Button } from "@headlessui/react";
import { createPortal } from "react-dom";
import { useAuthStore } from "@/store/useAuthStore";
import useModal from "@/hooks/useModal";
import ProfileModal from "@/components/MindMapHeader/ProfileModal";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const { open: loginModal, openModal: openLoginModal, closeModal: closeLoginModal } = useModal();
  const { open: profileModal, openModal: openProfileModal, closeModal: closeProfileModal } = useModal();
  const auth = useAuthStore();
  
  function handleProfileModal() {
    if (auth.isAuthenticated) {
      openProfileModal();
      return;
    }
    openLoginModal();
  }
  return (
    <>
      <div className="relative flex items-center gap-6">
        <Button onClick={handleProfileModal}>
          <FaUserCircle className="h-10 w-10" color="#93C5FD" />
        </Button>
        <ProfileModal open={profileModal} close={closeProfileModal} />
      </div>
      {createPortal(<LoginModal open={loginModal} close={closeLoginModal} />, document.body)}
    </>
  );
}

import LoginModal from "@/components/Modal/LoginModal";
import { Button } from "@headlessui/react";
import { createPortal } from "react-dom";
import useModal from "@/hooks/useModal";
import ProfileModal from "@/components/Modal/ProfileModal";
import { FaUserCircle } from "react-icons/fa";
import { useConnectionStore } from "@/store/useConnectionStore";

export default function Profile() {
  const { open: loginModal, openModal: openLoginModal, closeModal: closeLoginModal } = useModal();
  const { open: profileModal, openModal: openProfileModal, closeModal: closeProfileModal } = useModal();
  const isAuthenticated = useConnectionStore((state) => state.token);

  function handleProfileModal(e) {
    e.stopPropagation();
    if (isAuthenticated) {
      profileModal ? closeProfileModal() : openProfileModal();
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

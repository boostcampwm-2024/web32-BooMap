import profileIcon from "@/assets/profile.png";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@headlessui/react";
import { useEffect, useRef } from "react";
type ProfileModalProps = {
  open: boolean;
  close: () => void;
};
export default function ProfileModal({ open, close }: ProfileModalProps) {
  const auth = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    auth.logout();
    close();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, close]);

  return (
    <>
      {open && (
        <div ref={modalRef} className="absolute right-4 top-20 z-50 flex flex-col items-center bg-gray-900">
          <img src={profileIcon} alt="프로필" className="m-4 w-11" />
          <div className="w-full p-3 text-center">
            <p>{auth.nickname}</p>
            <p className="text-sm text-grayscale-300">{auth.email}</p>
          </div>
          <Button className="w-full p-3 hover:bg-grayscale-300" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      )}
    </>
  );
}

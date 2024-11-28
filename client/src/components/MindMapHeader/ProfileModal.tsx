import profileIcon from "@/assets/profile.png";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@headlessui/react";
import { useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
type ProfileModalProps = {
  open: boolean;
  close: () => void;
};
export default function ProfileModal({ open, close }: ProfileModalProps) {
  const auth = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
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
        <div
          ref={modalRef}
          className="absolute right-4 top-14 z-50 flex flex-col items-center rounded-lg bg-gray-900 pb-2"
        >
          <FaUserCircle className="my-5 h-11 w-11" color="#93C5FD" />
          <div className="w-full px-5 py-0 text-center">
            <p>{auth.name}</p>
            <p className="text-sm text-grayscale-300">{auth.email}</p>
          </div>
          <Button className="w-full p-3 px-5 text-sm transition hover:brightness-75" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      )}
    </>
  );
}

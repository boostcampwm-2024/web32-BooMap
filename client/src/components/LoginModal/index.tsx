import { Button } from "@headlessui/react";
import gitHubIcon from "@/assets/github-mark-white.png";
import kakaoIcon from "@/assets/kakao_login.png";
import { createPortal } from "react-dom";

type LoginModalProps = {
  open: boolean;
  close: () => void;
};
export default function LoginModal({ open, close }: LoginModalProps) {
  return (
    <>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 text-black"
            onClick={close}
          >
            <div
              className="relative flex w-96 flex-col gap-8 rounded-lg bg-white px-10 py-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Button className="absolute right-5 top-5 w-6 hover:bg-grayscale-100" onClick={close}>
                <p className="font-black text-grayscale-300">✕</p>
              </Button>
              <p className="text-2xl font-bold">로그인</p>
              <div className="flex flex-col gap-3">
                <a
                  href={`${import.meta.env.VITE_APP_API_SERVER_BASE_URL}/auth/github`}
                  className="flex h-[45.59px] items-center justify-center gap-2 rounded-md bg-black pl-4 pr-6 text-white transition hover:brightness-75"
                >
                  <img src={gitHubIcon} alt="Github" className="w-5" />
                  <span className="flex-grow text-sm">Login with Github</span>
                </a>
                <a
                  href={`${import.meta.env.VITE_APP_API_SERVER_BASE_URL}/auth/kakao`}
                  className="flex items-center justify-center gap-3 rounded-xl bg-grayscale-200 transition hover:brightness-90"
                >
                  <img src={kakaoIcon} alt="kakao" className="w-full" />
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

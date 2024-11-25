import { Button } from "@headlessui/react";
import closeIcon from "@/assets/close.png";
import gitHubIcon from "@/assets/github-mark-white.png";
import kakaoIcon from "@/assets/kakao_login.png";

type LoginModalProps = {
  open: boolean;
  close: () => void;
};
export default function LoginModal({ open, close }: LoginModalProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 text-black"
          onClick={close}
        >
          <div
            className="relative flex w-96 flex-col gap-8 rounded-lg bg-white px-10 py-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Button className="absolute right-5 top-5 w-6 hover:bg-grayscale-100" onClick={close}>
              <img src={closeIcon} alt="close" />
            </Button>
            <p className="text-2xl font-bold">로그인</p>
            <div className="flex flex-col gap-3">
              <a
                href={`${import.meta.env.VITE_APP_API_SERVER_BASE_URL}/auth/github`}
                className="flex items-center justify-center gap-3 rounded-lg bg-black p-3 pl-4 text-white"
              >
                <img src={gitHubIcon} alt="Github" className="w-7" />
                <span className="flex-grow">Login with Github</span>
              </a>
              <a
                href={`${import.meta.env.VITE_APP_API_SERVER_BASE_URL}/auth/kakao`}
                className="flex items-center justify-center gap-3 rounded-xl bg-grayscale-200"
              >
                <img src={kakaoIcon} alt="kakao" className="w-full" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

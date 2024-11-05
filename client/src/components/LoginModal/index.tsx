import { Button } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import closeIcon from "@/assets/close.png";
import gitHubIcon from "@/assets/gitHub.png";
import googleIcon from "@/assets/google.png";

type LoginModalProps = {
  open: boolean;
  close: () => void;
};
export default function LoginModal({ open, close }: LoginModalProps) {
  return (
    <>
      {open && (
        <div
          className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-30 text-black"
          onClick={close}
        >
          <div
            className="relative flex w-96 flex-col gap-8 rounded-lg bg-white px-10 py-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Button className="absolute right-5 top-5 w-6" onClick={close}>
              <img src={closeIcon} alt="close" />
            </Button>
            <p className="text-2xl font-bold">로그인</p>
            <div className="flex flex-col gap-3">
              <Button className="flex items-center justify-center gap-3 rounded-xl bg-grayscale-200 p-2">
                <img src={gitHubIcon} alt="Github" className="w-7" />
                Login with Github
              </Button>
              <Button className="flex items-center justify-center gap-3 rounded-xl bg-grayscale-200 p-2">
                <img src={googleIcon} alt="Google" className="w-7" />
                Login with Google
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

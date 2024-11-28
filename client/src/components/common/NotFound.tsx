import notFoundIcon from "@/assets/notFound.png";
import { Button } from "@headlessui/react";
export default function NotFound() {
  return (
    <div className="z-50 flex h-full w-full items-center justify-center gap-6">
      <img className="w-96" src={notFoundIcon} alt="notfound" />
      <div className="flex-center flex flex-col items-center">
        <p className="text-[100px] text-white">OOPS!</p>
        <p className="text-2xl text-grayscale-300">무언가 잘못됐어요</p>
        <Button
          className="mt-10 rounded-lg bg-bm-blue px-4 py-2 transition hover:brightness-90"
          onClick={() => (window.location.href = "/")}
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}

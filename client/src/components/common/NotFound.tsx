import { Button } from "@headlessui/react";
import notFoundIcon from "@/assets/notFound.webp";

export default function NotFound() {
  return (
    <div className="z-50 flex h-full w-full items-center justify-center gap-6">
      <img className="w-96" src={notFoundIcon} alt="notfound" />
      <div className="flex-center flex flex-col items-center">
        <p className="text-[100px] font-black text-white">404</p>
        <p className="text-2xl text-grayscale-300">페이지를 찾을 수 없습니다.</p>
        <p className="text-lg text-grayscale-300">페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</p>
        <p className="text-lg text-grayscale-300">입력한 주소가 정확한지 다시 한 번 확인해 주세요.</p>
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

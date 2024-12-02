import { Button } from "@headlessui/react";
import lockIcon from "@/assets/lock.webp";

export default function Forbidden() {
  return (
    <div className="z-50 flex h-full w-full items-center justify-center gap-6">
      <div className="flex-center flex flex-col items-center">
        <p className="text-[100px] font-black text-white">403</p>
        <p className="text-2xl text-grayscale-300">접근이 거부되었습니다.</p>
        <p className="text-lg text-grayscale-300">요청하신 페이지에 대한 접근이 거부되었습니다.</p>
        <p className="text-lg text-grayscale-300">입력한 주소가 정확한지 다시 한 번 확인해 주세요.</p>
        <Button
          className="mt-10 rounded-lg bg-bm-blue px-4 py-2 transition hover:brightness-90"
          onClick={() => (window.location.href = "/")}
        >
          Go to Homepage
        </Button>
      </div>
      <img className="w-96" src={lockIcon} alt="forbidden" />
    </div>
  );
}

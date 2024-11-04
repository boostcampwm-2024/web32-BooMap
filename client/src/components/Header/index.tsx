import { Button } from "@headlessui/react";
import profile from "@/assets/profile.png";
import shareIcon from "@/assets/share.png";
import exportIcon from "@/assets/export.png";

export default function Header() {
  return (
    <header className="w-full bg-grayscale-700 flex p-4 justify-between">
      <div className="flex gap-5">
        <Button className="bg-bm-blue text-grayscale-100 px-5 rounded-lg flex items-center gap-3">
          <img src={shareIcon} alt="공유하기" className="w-5" />
          Share
        </Button>
        <Button className="bg-grayscale-600 text-grayscale-100 px-5 rounded-lg flex items-center gap-3">
          <img src={exportIcon} alt="내보내기" className="w-5" />
          Export
        </Button>
      </div>
      <div className="flex gap-6">
        <Button className="bg-transparent text-grayscale-100">로그인</Button>
        <img src={profile} className="w-10 h-10" alt="프로필" />
      </div>
    </header>
  );
}

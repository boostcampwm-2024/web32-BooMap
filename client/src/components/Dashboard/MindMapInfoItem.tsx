import profile from "@/assets/profile.png";
import deleteIcon from "@/assets/trash2.png";
import { Button } from "@headlessui/react";

export default function MindMapInfoItem({ data, index }) {
  return (
    <div
      className={`${index !== 0 ? "border-t-[1px] border-t-grayscale-500" : ""} flex items-center justify-between px-3 py-2`}
    >
      <div className="min-w-72">{data.title}</div>
      <div className="grid w-44 grid-cols-2 gap-1 px-5 text-xs">
        {data.keyword.map((v, i) => {
          return (
            <span key={i} className="bg-bm-purple rounded-2xl px-4 py-[2px]">
              {v}
            </span>
          );
        })}
      </div>
      <div className="flex min-w-24 items-center justify-center gap-2">
        <img className="h-6 w-6" src={profile} alt="소유자 이미지" />
        <div>{data.owner.id}</div>
      </div>
      <div className="flex min-w-40 justify-between">
        <div>{data.createdAt}</div>
        <Button className="group" onClick={() => console.log("특정 마인드 맵 삭제")}>
          <img
            className="h-6 w-6 group-hover:brightness-0 group-hover:invert"
            src={deleteIcon}
            alt="마인드 맵 삭제 버튼"
          />
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@headlessui/react";
import { FaLightbulb } from "react-icons/fa6";

export default function ShowShortCut() {
  return (
    <div className="group relative bottom-[66px] left-[5px] text-sm">
      <Button className="p-2">
        <FaLightbulb size={20} color="#98A4EE" />
      </Button>
      <div className="absolute bottom-[40px] left-2 mt-2 hidden rounded-md bg-grayscale-700 px-2 py-3 text-white group-hover:block">
        <div className="flex flex-col gap-3">
          <p>
            <Btn>Ctrl</Btn> + <Btn>Z</Btn> : 뒤로가기
          </p>
          <p>
            <Btn>Ctrl</Btn> + <Btn>Shift</Btn> + <Btn>Z</Btn> : 앞으로가기
          </p>
          <p>
            <Btn>Click</Btn> + <Btn>Backspace</Btn> : 노드 삭제
          </p>
          <p>
            <Btn>Click</Btn> + <Btn>=</Btn> : 노드 추가
          </p>
          <p>
            <Btn>Shift</Btn> + <Btn>Drag</Btn> : 노드 다중 선택
          </p>
          <p>
            <Btn>Spacebar</Btn> : 손모양 전환
          </p>
        </div>
      </div>
    </div>
  );
}

function Btn({ children }) {
  return <span className="rounded-[6px] bg-white px-2 py-1 text-grayscale-500">{children}</span>;
}

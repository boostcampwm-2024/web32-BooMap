import React from "react";
import { Button } from "@headlessui/react";
import { FaLightbulb } from "react-icons/fa6";

const shortcuts = [
  { keys: ["Ctrl", "Z"], description: "뒤로가기" },
  { keys: ["Ctrl", "Shift", "Z"], description: "앞으로가기" },
  { keys: ["Ctrl", "Backspace"], description: "노드 삭제" },
  { keys: ["Ctrl", "="], description: "노드 추가" },
  { keys: ["Shift", "Drag"], description: "노드 다중 선택" },
  { keys: ["SpaceBar"], description: "손모양 전환" },
];

export default function ShowShortCut() {
  function Btn({ children }) {
    return <span className="rounded-[6px] bg-white px-2 py-1 text-grayscale-500">{children}</span>;
  }

  return (
    <div className="group relative bottom-[66px] left-[5px] text-sm">
      <Button className="p-2">
        <FaLightbulb size={20} color="#98A4EE" />
      </Button>
      <div className="absolute bottom-[40px] left-2 mt-2 hidden rounded-md bg-grayscale-700 px-2 py-3 text-white group-hover:block">
        <div className="flex flex-col gap-3">
          {shortcuts.map(({ keys, description }, index) => (
            <p key={index}>
              {keys.map((key, i) => (
                <React.Fragment key={i}>
                  <Btn>{key}</Btn>
                  {i < keys.length - 1 && " + "}
                </React.Fragment>
              ))}
              : {description}
            </p>
          ))}
        </div>
        ;
      </div>
    </div>
  );
}

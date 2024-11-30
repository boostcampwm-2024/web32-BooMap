import React, { useState } from "react";
import { Button } from "@headlessui/react";
import { FaLightbulb } from "react-icons/fa6";

const shortcuts = [
  { keys: ["="], description: "노드 추가" },
  { keys: ["Backspace"], description: "노드 삭제" },
  { keys: ["Shift", "Drag"], description: "노드 다중 선택" },
  { keys: ["Shift", "Move"], description: "하위 노드 이동" },
  { keys: ["SpaceBar"], description: "손모양 전환" },
  { keys: ["Ctrl", "Z"], description: "뒤로가기" },
  { keys: ["Ctrl", "Shift", "Z"], description: "앞으로가기" },
];

export default function ShowShortCut() {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function Btn({ children }) {
    return <span className="rounded-[6px] bg-white px-2 py-1 text-grayscale-500">{children}</span>;
  }

  const isOpen = isClicked || isHovered;

  return (
    <div
      className="absolute left-2 top-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        className="cursor-pointer p-2"
        onClick={(e) => {
          e.stopPropagation();
          setIsClicked((prev) => !prev);
        }}
      >
        <FaLightbulb size={20} color="#98A4EE" />
      </Button>
      {isOpen ? (
        <div className="absolute left-2 top-[35px] w-64 rounded-lg bg-grayscale-700 px-2 py-3 text-white">
          <div className="flex flex-col gap-3">
            {shortcuts.map(({ keys, description }, index) => (
              <p key={index}>
                {keys.map((key, i) => (
                  <React.Fragment key={i}>
                    <Btn>{key}</Btn>
                    {i < keys.length - 1 && " + "}
                  </React.Fragment>
                ))}
                <span> : </span>
                {description}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

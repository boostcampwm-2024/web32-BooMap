import React, { useState } from "react";
import { Button } from "@headlessui/react";
import { FaLightbulb } from "react-icons/fa6";

const shortcuts = [
  { keys: ["="], description: "노드 추가" },
  { keys: ["Backspace"], description: "노드 삭제" },
  { keys: ["Shift", "Drag"], description: "노드 다중 선택" },
  { keys: ["Shift", "Move"], description: "하위 노드 이동" },
  { keys: ["Enter"], description: "키워드 편집 활성화/비활성화" },
  { keys: ["SpaceBar"], description: "손모양 전환" },
  { keys: ["Ctrl", "Z"], description: "뒤로가기" },
  { keys: ["Ctrl", "Shift", "Z"], description: "앞으로가기" },
  { keys: ["Tab"], description: "다음 노드로 이동" },
  { keys: ["Shift", "Tab"], description: "이전 노드로 이동" },
];

export default function ShowShortCut() {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  function Btn({ children }) {
    return <span className="rounded-[6px] bg-white px-2 py-1 text-grayscale-500">{children}</span>;
  }

  function handleButtonClick(e) {
    e.stopPropagation();
    if (!isClicked) {
      setIsClicked(true);
      setIsVisible(true);
    } else {
      setIsClicked(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }
  }

  return (
    <>
      <div className="absolute top-0" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Button className="flex cursor-pointer items-center justify-center p-2" onClick={handleButtonClick}>
          <FaLightbulb size={20} color="#98A4EE" />
          {isHovered ? <p className="text-sm text-black">&lt;-Click Me</p> : <></>}
        </Button>
      </div>

      <div
        className={`absolute left-[-304px] top-0 w-72 transform rounded-[20px] bg-bm-purple px-4 py-4 transition-all duration-500 ease-in-out ${
          isClicked ? "translate-x-0 opacity-100" : "translate-x-[-20px] opacity-0"
        }`}
      >
        {isClicked || isVisible ? (
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
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

import { Button } from "@headlessui/react";
import arrowDown from "@/assets/arrowDown.png";

export default function ToggleButton({ isSidebarOpen, toggleSidebar }) {
  return (
    <Button
      onClick={toggleSidebar}
      className={`absolute top-20 h-10 w-10 rounded-r-lg bg-grayscale-600 transition-all duration-300 ${
        isSidebarOpen ? "left-64" : "left-0"
      }`}
    >
      <div
        className={`ml-[-2px] flex w-full flex-col items-center justify-center transition-transform duration-300 ${isSidebarOpen ? "rotate-90" : "-rotate-90"} `}
      >
        <img className="h-3 w-5" src={arrowDown} alt="토글 화살표" />
        <img className="h-3 w-5" src={arrowDown} alt="토글 화살표" />
      </div>
    </Button>
  );
}

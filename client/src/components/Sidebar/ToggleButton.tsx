import { Button } from "@headlessui/react";
import { FaAnglesLeft } from "react-icons/fa6";

export default function ToggleButton({ isSidebarOpen, toggleSidebar }) {
  const animateOptions = {
    button: isSidebarOpen ? "left-64" : "left-0",
    arrow: isSidebarOpen ? "rotate-0" : "rotate-180",
  };
  const transitionClasses = {
    button: "transition-all duration-300",
    arrow: "transition-transform duration-300",
  };

  return (
    <Button
      onClick={toggleSidebar}
      className={`absolute top-20 h-10 w-10 rounded-r-lg bg-grayscale-600 ${transitionClasses.button} ${animateOptions.button}`}
    >
      <div
        className={`flex w-full flex-col items-center justify-center ${transitionClasses.arrow} ${animateOptions.arrow} `}
      >
        <FaAnglesLeft className="text-2xl text-grayscale-200" />
      </div>
    </Button>
  );
}

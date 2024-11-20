import { Button } from "@headlessui/react";
import arrowDown from "@/assets/arrowDown.png";

export default function ToggleButton({ isSidebarOpen, toggleSidebar }) {
  const animateOptions = {
    button: isSidebarOpen ? "left-64" : "left-0",
    arrow: isSidebarOpen ? "rotate-90" : "-rotate-90",
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
        className={`ml-[-2px] flex w-full flex-col items-center justify-center ${transitionClasses.arrow} ${animateOptions.arrow} `}
      >
        <img className="h-3 w-5" src={arrowDown} alt="토글 화살표" />
        <img className="h-3 w-5" src={arrowDown} alt="토글 화살표" />
      </div>
    </Button>
  );
}

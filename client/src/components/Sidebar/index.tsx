import logo from "@/assets/logo.png";
import Overview from "@/components/Sidebar/Overview";
import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import arrowDown from "@/assets/arrowDown.png";

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      <aside
        className={`absolute left-0 top-0 h-full min-w-64 transform bg-grayscale-800 p-4 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div
          className="flex w-full cursor-pointer items-center justify-center gap-4 text-2xl font-black"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="로고" className="w-12" />
          BOOMAP
        </div>
        <Overview />
      </aside>
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
    </>
  );
}

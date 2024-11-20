import logo from "@/assets/logo.png";
import Overview from "@/components/Sidebar/Overview";
import { useNavigate } from "react-router-dom";
import ToggleButton from "./ToggleButton";

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();

  const animateOptions = isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0";
  const transitionClasses = "transition-all duration-300 ease-in-out";

  return (
    <>
      <aside
        className={`absolute left-0 top-0 h-full min-w-64 transform bg-grayscale-800 p-4 ${transitionClasses} ${animateOptions}`}
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
      <ToggleButton isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

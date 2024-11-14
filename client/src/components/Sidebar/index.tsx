import logo from "@/assets/logo.png";
import Overview from "@/components/Sidebar/Overview";
import { useNavigate } from "react-router-dom";
useNavigate;

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex h-full min-w-64 flex-col bg-grayscale-800 p-4">
      <div
        className="flex w-full cursor-pointer items-center justify-center gap-4 text-2xl font-black"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="로고" className="w-12" />
        BOOMAP
      </div>
      <Overview />
    </aside>
  );
}

import Spinner from "@/components/common/Spinner";
import Sidebar from "@/components/Sidebar";
import useAuth from "@/hooks/useAuth";
import { useSideBar } from "@/store/useSideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const sidebar = useSideBar();
  const { isLoading } = useAuth();
  return (
    <div className="flex h-full w-full">
      <div className={`flex flex-grow flex-col transition-all duration-300 ${sidebar.open ? "ml-64" : "ml-0"}`}>
        {isLoading && <Spinner />}
        <Sidebar isSidebarOpen={sidebar.open} toggleSidebar={sidebar.toggleSideBar} />
        <Outlet />
      </div>
    </div>
  );
}

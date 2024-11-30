import NotFound from "@/components/common/NotFound";
import Sidebar from "@/components/Sidebar";
import { useSideBar } from "@/store/useSideBar";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { useConnectionStore } from "@/store/useConnectionStore";

export default function Layout() {
  const sidebar = useSideBar();
  const connectionStatus = useConnectionStore((state) => state.connectionStatus);

  if (connectionStatus === "error") return <NotFound />;

  return (
    <ErrorBoundary fallback={<NotFound />}>
      <div className="flex h-full w-full">
        <div className={`flex flex-grow flex-col transition-all duration-300 ${sidebar.open ? "ml-64" : "ml-0"}`}>
          <Sidebar isSidebarOpen={sidebar.open} toggleSidebar={sidebar.toggleSideBar} />
          <Outlet />
        </div>
      </div>
    </ErrorBoundary>
  );
}

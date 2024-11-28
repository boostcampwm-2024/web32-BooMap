import NotFound from "@/components/common/NotFound";
import Sidebar from "@/components/Sidebar";
import { useSideBar } from "@/store/useSideBar";
import { useSocketStore } from "@/store/useSocketStore";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const sidebar = useSideBar();
  const { connectionStatus } = useSocketStore();

  // if (connectionStatus === "error") return <NotFound />;
  // TODO: svg 사전로딩 문제 해결되면 주석 풀기...

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

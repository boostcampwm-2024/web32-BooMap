import Error from "@/components/common/Error";
import Sidebar from "@/components/Sidebar";
import { useSideBar } from "@/store/useSideBar";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { useConnectionStore } from "@/store/useConnectionStore";
import OfflineModal from "@/components/OfflineModal";
import useWindowEventListener from "@/hooks/useWindowEventListener";
import { useState } from "react";

export default function Layout() {
  const sidebar = useSideBar();
  const connectionStatus = useConnectionStore((state) => state.connectionStatus);
  const [modalOpen, setModalOpen] = useState(false);

  useWindowEventListener("offline", () => {
    setModalOpen(true);
  });

  if (connectionStatus === "error") return <Error />;

  return (
    <ErrorBoundary fallback={<Error />}>
      {modalOpen && <OfflineModal open={modalOpen} closeModal={() => setModalOpen(false)} />}
      <div className="flex h-full w-full">
        <div className={`flex flex-grow flex-col transition-all duration-300 ${sidebar.open ? "ml-64" : "ml-0"}`}>
          <Sidebar isSidebarOpen={sidebar.open} toggleSidebar={sidebar.toggleSideBar} />
          <Outlet />
        </div>
      </div>
    </ErrorBoundary>
  );
}

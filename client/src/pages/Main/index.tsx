import Spinner from "@/components/common/Spinner";
import Header from "@/components/Header";
import MainSection from "@/components/MainSection";
import Sidebar from "@/components/Sidebar";
import NodeListProvider from "@/store/NodeListProvider";
import { useState } from "react";

import useAuth from "@/hooks/useAuth";

export default function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { isLoading } = useAuth();
  return (
    <div className="flex h-full w-full">
      {isLoading && <Spinner />}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex flex-grow flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="flex h-full w-full flex-col">
          <NodeListProvider>
            <Header />
            <MainSection />
          </NodeListProvider>
        </div>
      </div>
    </div>
  );
}

import Header from "@/components/Header";
import MainSection from "@/components/MainSection";
import Sidebar from "@/components/Sidebar";

export default function MainPage() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex flex-grow">
        <div className="flex h-full w-full flex-col">
          <Header />
          <MainSection />
        </div>
      </div>
    </div>
  );
}

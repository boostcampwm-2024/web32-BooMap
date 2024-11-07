import Header from "@/components/Header";
import MainSection from "@/components/MainSection";
import Sidebar from "@/components/Sidebar";

export default function MainPage() {
  return (
    <main className="flex h-full w-full">
      <Sidebar />
      <div className="flex flex-grow flex-col">
        <Header />
        <MainSection />
      </div>
    </main>
  );
}

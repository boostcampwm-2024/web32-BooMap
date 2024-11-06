import Header from "@/components/Header";
import MainSection from "@/components/MainSection";
import Sidebar from "@/components/Sidebar";

export default function MainPage() {
  return (
    <main className="flex h-screen min-h-[700px] w-full min-w-[900px]">
      <Sidebar />
      <div className="flex h-full w-full flex-col">
        <Header />
        <MainSection />
      </div>
    </main>
  );
}

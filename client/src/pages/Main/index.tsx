import Header from "@/components/Header";
import MainSection from "@/components/MainSection";
import Sidebar from "@/components/Sidebar";

export default function MainPage() {
  return (
    <main className="w-screen h-screen flex">
      <Sidebar />
      <div className="w-full h-screen flex flex-col">
        <Header />
        <MainSection />
      </div>
    </main>
  );
}

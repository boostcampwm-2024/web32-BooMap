import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function MainPage() {
  return (
    <main className="w-screen h-screen flex">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Header />
      </div>
    </main>
  );
}

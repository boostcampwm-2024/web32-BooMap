import DashBoard from "@/components/Dashboard";
import Profile from "@/components/MindMapHeader/Profile";

export default function MainPage() {
  return (
    <>
      <header className={`flex w-full justify-end bg-transparent p-4`}>
        <Profile />
      </header>
      <main className="flex h-[90%] w-full flex-col overflow-hidden p-8">
        <p className="p-3 text-2xl font-bold">대시보드</p>
        <div className="relative flex h-[90%] w-full gap-4">
          <DashBoard />
        </div>
      </main>
    </>
  );
}

import logo from "@/assets/logo.png";
import Overview from "@/components/Sidebar/Overview";

export default function Sidebar() {
  return (
    <aside className="flex min-w-72 flex-col bg-grayscale-800 p-4">
      <div className="flex w-full items-center justify-center gap-4 text-3xl font-black">
        <img src={logo} alt="로고" className="w-12" />
        BOOMAP
      </div>
      <Overview />
    </aside>
  );
}

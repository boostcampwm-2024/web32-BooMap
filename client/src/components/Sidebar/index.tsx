import logo from "@/assets/logo.png";
import Overview from "@/components/Sidebar/Overview";

export default function Sidebar() {
  return (
    <aside className="min-w-80 flex flex-col p-4 bg-grayscale-800">
      <div className="flex items-center text-3xl gap-4 w-full justify-center font-black">
        <img src={logo} alt="로고" className="w-12" />
        BOOMAP
      </div>
      <Overview />
    </aside>
  );
}

import { useSearchParams } from "react-router-dom";
import Profile from "@/components/Header/profile";
import MindMapHeaderButtons from "@/components/Header/mindMapHeaderButtons";
import { MODEVIEW } from "@/constants/modeview";

export default function Header() {
  const [searchParams] = useSearchParams();

  const headerStyleOptions = MODEVIEW[searchParams.get("mode")] ? "justify-between" : "justify-end";

  return (
    <header className={`flex w-full bg-grayscale-700 p-4 ${headerStyleOptions}`}>
      {MODEVIEW[searchParams.get("mode")] && <MindMapHeaderButtons />}
      <Profile />
    </header>
  );
}

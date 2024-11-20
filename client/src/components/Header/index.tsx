import { useSearchParams } from "react-router-dom";
import { MODEVIEW } from "@/constants/modeview";
import MindMapHeaderButtons from "@/components/Header/MindMapHeaderButtons";
import Profile from "@/components/Header/Profile";

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

import MindMapHeaderButtons from "@/components/MindMapHeader/MindMapHeaderButtons";
import Profile from "@/components/MindMapHeader/Profile";

export default function MindMapHeader() {
  return (
    <header className={`flex w-full justify-between bg-grayscale-700 p-4`}>
      <MindMapHeaderButtons />
      <Profile />
    </header>
  );
}

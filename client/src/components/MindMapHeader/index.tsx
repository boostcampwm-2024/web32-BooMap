import MindMapHeaderButtons from "@/components/MindMapHeader/MindMapHeaderButtons";
import Profile from "@/components/MindMapHeader/Profile";
import { useNodeListContext } from "@/store/NodeListProvider";
import { Input } from "@headlessui/react";
import { useState } from "react";
import { RiMindMap } from "react-icons/ri";

export default function MindMapHeader() {
  const { title, updateTitle } = useNodeListContext();
  const [editMode, setEditMode] = useState(false);

  function handleInputBlur() {
    setEditMode(false);
  }
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (e.key === "Enter") {
      setEditMode(false);
    }
  }

  return (
    <header className="flex w-full justify-between bg-grayscale-700 p-4">
      <MindMapHeaderButtons />
      {editMode ? (
        <Input
          className="flex items-center bg-transparent text-center"
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      ) : (
        <span onDoubleClick={() => setEditMode(true)} className="flex cursor-pointer items-center gap-3 text-lg">
          <RiMindMap className="h-5 w-5" />
          {title}
        </span>
      )}
      <Profile />
    </header>
  );
}

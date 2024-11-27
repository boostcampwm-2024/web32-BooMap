import MindMapHeaderButtons from "@/components/MindMapHeader/MindMapHeaderButtons";
import Profile from "@/components/MindMapHeader/Profile";
import { useNodeListContext } from "@/store/NodeListProvider";
import { Input } from "@headlessui/react";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";

export default function MindMapHeader() {
  const { title, updateTitle, isOwner } = useNodeListContext();
  const [editMode, setEditMode] = useState(false);

  function handleInputBlur() {
    if (!title.length) return;
    setEditMode(false);
  }

  function changeToEditMode() {
    if (!isOwner) return;
    setEditMode(true);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleInputBlur();
    }
  }

  return (
    <header className="flex w-full justify-between bg-grayscale-700 p-4">
      <MindMapHeaderButtons />
      {editMode ? (
        <Input
          className="flex w-80 items-center bg-transparent text-center"
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          maxLength={32}
        />
      ) : (
        <span onDoubleClick={changeToEditMode} className="flex cursor-pointer items-center gap-3 text-lg">
          {title}
          <FaPencilAlt onClick={changeToEditMode} />
        </span>
      )}
      <Profile />
    </header>
  );
}

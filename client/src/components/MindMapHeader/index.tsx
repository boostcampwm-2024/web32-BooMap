import MindMapHeaderButtons from "@/components/MindMapHeader/MindMapHeaderButtons";
import Profile from "@/components/MindMapHeader/Profile";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useConnectionStore } from "@/store/useConnectionStore";
import { Input } from "@headlessui/react";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";

export default function MindMapHeader() {
  const { title, updateTitle } = useNodeListContext();
  const originalContent = title;
  const [editMode, setEditMode] = useState(false);
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const role = useConnectionStore((state) => state.currentRole);
  const currentJobStatus = useConnectionStore((state) => state.currentJobStatus);

  function handleInputBlur() {
    if (!title.length) {
      setEditMode(false);
      return;
    }

    handleSocketEvent({
      actionType: "updateTitle",
      payload: { title: title },
      callback: (response) => {
        updateTitle(response.title);
      },
    });
    if (currentJobStatus === "error") updateTitle(originalContent);
    setEditMode(false);
  }

  function changeToEditMode() {
    if (!role || role === "editor") return;
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
          autoFocus
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

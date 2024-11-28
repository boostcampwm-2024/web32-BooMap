import Spinner from "@/components/common/Spinner";
import MindMapHeaderButtons from "@/components/MindMapHeader/MindMapHeaderButtons";
import Profile from "@/components/MindMapHeader/Profile";
import useAuth from "@/hooks/useAuth";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useSocketStore } from "@/store/useSocketStore";
import { Input } from "@headlessui/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { FaPencilAlt } from "react-icons/fa";

export default function MindMapHeader() {
  const { title, updateTitle } = useNodeListContext();
  const { isLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const handleSocketEvent = useSocketStore((state) => state.handleSocketEvent);
  const [editTitle, setEditTitle] = useState(title);
  const role = useSocketStore((state) => state.role);

  function handleInputBlur() {
    if (!title.length) return;
    handleSocketEvent({
      actionType: "updateTitle",
      payload: { title: editTitle },
    });
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
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
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
      {isLoading && createPortal(<Spinner />, document.body)}
    </header>
  );
}

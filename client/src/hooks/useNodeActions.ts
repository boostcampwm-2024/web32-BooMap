import { useNodeListContext } from "@/store/NodeListProvider";
import { ChangeEvent, KeyboardEvent, useState } from "react";

export default function useNodeActions(id: number, content: string) {
  const [hover, setHover] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [keyword, setKeyword] = useState(content);
  const { data, updateNode, saveHistory } = useNodeListContext();

  const originalContent = content;

  function saveContent() {
    if (keyword.trim()) {
      saveHistory(JSON.stringify(data));
      updateNode(id, { ...data[id], keyword: keyword });
    } else {
      setKeyword(originalContent);
    }
    setIsEditing(false);
  }

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function handleDoubleClick() {
    setIsEditing(true);
  }

  function handleBlur() {
    saveContent();
  }

  function handleChangeKeyword(e: ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter") saveContent();
  }

  return {
    hover,
    isEditing,
    setIsEditing,
    keyword,
    handleMouseEnter,
    handleMouseLeave,
    handleDoubleClick,
    handleBlur,
    handleChangeKeyword,
    handleKeyDown,
  };
}

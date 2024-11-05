import { ChangeEvent, KeyboardEvent, useState } from "react";

export default function useNodeActions(content: string) {
  const [hover, setHover] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [keyword, setKeyword] = useState(content);

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
    setIsEditing(false);
  }
  function handleChangeKeyword(e: ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter") {
      setIsEditing(false);
    }
  }
  return {
    hover,
    isEditing,
    keyword,
    handleMouseEnter,
    handleMouseLeave,
    handleDoubleClick,
    handleBlur,
    handleChangeKeyword,
    handleKeyDown,
  };
}

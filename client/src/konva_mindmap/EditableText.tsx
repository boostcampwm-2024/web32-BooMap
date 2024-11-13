import EditableTextInput from "./EditableTextInput";
import { Text } from "react-konva";
import { useState } from "react";
import { useNodeListContext } from "@/store/NodeListProvider";

interface EditableTextProps {
  id: number;
  text: string;
  name: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  offsetX: number;
  offsetY: number;
  width: number;
}

export default function EditableText({
  id,
  text,
  isEditing,
  setIsEditing,
  offsetX,
  offsetY,
  width,
}: EditableTextProps) {
  const [content, setContent] = useState(text);
  const { data, updateNodeList } = useNodeListContext();

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContent(e.target.value);
  }

  function saveContent() {
    if (content.trim() !== "") {
      updateNodeList(id, { ...data[id], keyword: content });
      setIsEditing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") saveContent();
  }

  function handleBlur() {
    saveContent();
  }

  return (
    <>
      {isEditing ? (
        <EditableTextInput value={content} onChange={handleTextChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
      ) : (
        <Text
          text={content}
          fill="black"
          wrap="word"
          align="center"
          fontStyle="bold"
          offsetX={offsetX}
          offsetY={offsetY}
          width={width}
        />
      )}
    </>
  );
}

import { Text } from "react-konva";
import { useEffect, useState } from "react";
import { useNodeListContext } from "@/store/NodeListProvider";
import EditableTextInput from "@/konva_mindmap/components/EditableTextInput";

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
  const originalContent = text;
  const [content, setContent] = useState(originalContent);
  const { data, updateNode, saveHistory } = useNodeListContext();

  useEffect(() => {
    setContent(text);
  }, [text]);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContent(e.target.value);
  }

  function saveContent() {
    if (content.trim()) {
      saveHistory(JSON.stringify(data));
      updateNode(id, { ...data[id], keyword: content });
    } else {
      setContent(originalContent);
    }
    setIsEditing(false);
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
        <EditableTextInput
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          offsetX={offsetX}
          offsetY={offsetY}
          width={width}
        />
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

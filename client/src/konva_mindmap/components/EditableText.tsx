import { Text } from "react-konva";
import { useEffect, useState } from "react";
import { useNodeListContext } from "@/store/NodeListProvider";
import EditableTextInput from "@/konva_mindmap/components/EditableTextInput";
import { useSocketStore } from "@/store/useSocketStore";
import { TEXT_FONT_SIZE } from "@/konva_mindmap/utils/nodeAttrs";

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
  const [keyword, setKeyword] = useState(originalContent);
  const { data, updateNode, saveHistory } = useNodeListContext();
  const { handleSocketEvent, currentJobStatus } = useSocketStore();

  useEffect(() => {
    setKeyword(text);
  }, [text]);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }

  function saveContent() {
    if (keyword.trim() && keyword !== originalContent) {
      handleSocketEvent({
        actionType: "updateNode",
        payload: { ...data, [id]: { ...data[id], keyword: keyword } },
        callback: () => {
          saveHistory(JSON.stringify(data));
          updateNode(id, { keyword: keyword });
        },
      });
      if (currentJobStatus === "error") setKeyword(originalContent);
    } else {
      setKeyword(originalContent);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (e.key === "Enter") setIsEditing(false);
  }

  function handleBlur() {
    saveContent();
  }

  return (
    <>
      {isEditing ? (
        <EditableTextInput
          focus={true}
          value={keyword}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          offsetX={offsetX}
          offsetY={offsetY}
          width={width}
        />
      ) : (
        <Text
          fontSize={TEXT_FONT_SIZE}
          text={keyword}
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

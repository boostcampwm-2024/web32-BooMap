import { Text } from "react-konva";
import { useEffect, useState } from "react";
import { useNodeListContext } from "@/store/NodeListProvider";
import EditableTextInput from "@/konva_mindmap/components/EditableTextInput";
import { TEXT_FONT_SIZE } from "@/konva_mindmap/utils/nodeAttrs";
import { useConnectionStore } from "@/store/useConnectionStore";

interface EditableTextProps {
  id: number;
  text: string;
  name: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  offsetX: number;
  offsetY: number;
  width: number;
  scale: number;
}

export default function EditableText({
  id,
  text,
  isEditing,
  setIsEditing,
  offsetX,
  offsetY,
  width,
  scale,
}: EditableTextProps) {
  const originalContent = text;
  const [keyword, setKeyword] = useState(originalContent);
  const { data, updateNode, saveHistory } = useNodeListContext();
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const currentJobStatus = useConnectionStore((state) => state.currentJobStatus);

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
    if (e.key === "Enter" || e.code === "Escape") setIsEditing(false);
  }

  function handleBlur() {
    saveContent();
  }

  const fontSize = scale >= 1 ? TEXT_FONT_SIZE : TEXT_FONT_SIZE / scale;
  offsetX = scale >= 1 ? offsetX : offsetX / scale;
  width = scale >= 1 ? width : width / scale;

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
          scale={scale}
        />
      ) : (
        <Text
          fontSize={fontSize}
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

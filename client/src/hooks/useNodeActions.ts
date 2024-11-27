import { addNode } from "@/konva_mindmap/events/addNode";
import { deleteNodes } from "@/konva_mindmap/events/deleteNode";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useSocketStore } from "@/store/useSocketStore";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

export default function useNodeActions(nodeId: number, content: string) {
  const [hover, setHover] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [keyword, setKeyword] = useState(content);
  const { data, updateNode, saveHistory, overrideNodeData } = useNodeListContext();
  const handleSocketEvent = useSocketStore((state) => state.handleSocketEvent);

  useEffect(() => {
    setKeyword(content);
  }, [content]);

  const originalContent = content;

  function saveContent() {
    if (keyword.trim() && keyword !== originalContent) {
      handleSocketEvent({
        actionType: "updateNode",
        payload: { ...data, [nodeId]: { ...data[nodeId], keyword: keyword, newNode: false } },
        callback: () => {
          saveHistory(JSON.stringify(data));
          addNode(keyword, nodeId, updateNode);
        },
      });
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
    e.stopPropagation();
    if (e.key == "Enter" && !e.nativeEvent.isComposing) saveContent();
  }

  function handleDelete() {
    const stringifiedData = JSON.stringify(data);
    saveHistory(stringifiedData);
    deleteNodes(stringifiedData, nodeId, overrideNodeData);
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
    handleDelete,
  };
}

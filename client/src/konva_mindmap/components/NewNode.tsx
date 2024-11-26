import { colors } from "@/constants/color";
import EditableTextInput from "@/konva_mindmap/components/EditableTextInput";
import { addNode } from "@/konva_mindmap/events/addNode";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useSocketStore } from "@/store/useSocketStore";
import { NodeProps } from "@/types/Node";
import { useRef, useState } from "react";
import { Circle, Group } from "react-konva";

export default function NewNode({ data, node, depth }: NodeProps) {
  const { saveHistory, selectedNode, updateNode } = useNodeListContext();
  const [keyword, setKeyword] = useState("제목없음");
  const handleSocketEvent = useSocketStore.getState().handleSocketEvent;
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }

  function saveContent() {
    const content = keyword.trim() ? keyword : "제목없음";
    setKeyword(content);
    handleSocketEvent({
      actionType: "updateNode",
      payload: { ...data, [node.id]: { ...data[node.id], keyword: content, newNode: false } },
      callback: (response) => {
        saveHistory(JSON.stringify(response));
        addNode(content, node.id, updateNode);
      },
    });
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (e.key === "Enter" && e.nativeEvent.isComposing == false) e.currentTarget.blur();
  }

  function handleBlur() {
    saveContent();
  }

  return (
    <Group name="newNode" id={node.id.toString()} x={node.location.x} y={node.location.y}>
      <Circle
        fill={selectedNode?.nodeId === node.id ? "orange" : colors[depth - 1]}
        width={100}
        height={100}
        strokeWidth={3}
        radius={60 - depth * 10}
        shadowBlur={5}
      />
      <EditableTextInput
        ref={inputRef}
        focus={selectedNode.addTo === "canvas"}
        value={keyword}
        offsetX={70 - depth * 10}
        offsetY={8 * depth - 60}
        width={140 - depth * 20}
        onBlur={handleBlur}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      />
    </Group>
  );
}

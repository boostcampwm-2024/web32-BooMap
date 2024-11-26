import { colors } from "@/constants/color";
import EditableTextInput from "@/konva_mindmap/components/EditableTextInput";
import { addNode } from "@/konva_mindmap/events/addNode";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useSocketStore } from "@/store/useSocketStore";
import { NodeProps } from "@/types/Node";
import { useEffect, useState } from "react";
import { Circle, Group } from "react-konva";

export default function NewNode({ data, node, depth }: NodeProps) {
  const { saveHistory, selectedNode, updateNode } = useNodeListContext();
  const [keyword, setKeyword] = useState("제목없음");
  useEffect(() => {
    setKeyword(keyword);
  }, [keyword]);

  const handleSocketEvent = useSocketStore.getState().handleSocketEvent;

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }

  function saveContent() {
    if (keyword.trim()) {
      handleSocketEvent({
        actionType: "updateNode",
        payload: { ...data, [node.id]: { ...data[node.id], keyword: keyword, newNode: false } },
        callback: () => {
          saveHistory(JSON.stringify(data));
          addNode(keyword, node.id, updateNode);
        },
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") saveContent();
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

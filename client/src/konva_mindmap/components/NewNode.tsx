import { colors } from "@/constants/color";
import EditableTextInput from "@/konva_mindmap/components/EditableTextInput";
import { addNode } from "@/konva_mindmap/events/addNode";
import { useNodeListContext } from "@/store/NodeListProvider";
import { NodeProps } from "@/types/Node";
import { useState } from "react";
import { Circle, Group } from "react-konva";
import { NODE_RADIUS, NODE_WIDTH_AND_HEIGHT, TEXT_OFFSET_X, TEXT_OFFSET_Y, TEXT_WIDTH } from "../utils/nodeAttrs";
import { useConnectionStore } from "@/store/useConnectionStore";

export default function NewNode({ data, node, depth }: NodeProps) {
  const { saveHistory, selectedNode, updateNode } = useNodeListContext();
  const [keyword, setKeyword] = useState("제목없음");
  const handleSocketEvent = useConnectionStore.getState().handleSocketEvent;

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
        width={NODE_WIDTH_AND_HEIGHT}
        height={NODE_WIDTH_AND_HEIGHT}
        strokeWidth={3}
        radius={NODE_RADIUS(depth)}
        shadowBlur={5}
      />
      <EditableTextInput
        focus={selectedNode.addTo === "canvas"}
        value={keyword}
        offsetX={TEXT_OFFSET_X(depth)}
        offsetY={TEXT_OFFSET_Y(depth)}
        width={TEXT_WIDTH(depth)}
        onBlur={handleBlur}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      />
    </Group>
  );
}

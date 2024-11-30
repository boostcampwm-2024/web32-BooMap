import EditableText from "@/konva_mindmap/components/EditableText";
import { NodeProps } from "@/types/Node";
import { Circle, Group } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useRef, useState } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { checkFollowing, resetSavedOffsets, saveOffsets } from "@/konva_mindmap/utils/following";
import { colors } from "@/constants/color";
import Konva from "konva";
import { getMovedNodesLocation } from "@/konva_mindmap/utils/select";
import {
  NODE_RADIUS,
  NODE_WIDTH_AND_HEIGHT,
  TEXT_OFFSET_X,
  TEXT_OFFSET_Y,
  TEXT_WIDTH,
  TOOL_OFFSET_X,
  TOOL_OFFSET_Y,
} from "@/konva_mindmap/utils/nodeAttrs";
import NodeTool from "@/konva_mindmap/components/NodeTool";
import { deleteNodes } from "@/konva_mindmap/events/deleteNode";
import { addNode } from "@/konva_mindmap/events/addNode";
import useWindowEventListener from "@/hooks/useWindowEventListener";

export default function MindMapNode({ data, parentNode, node, depth, parentRef, dragmode }: NodeProps) {
  const nodeRef = useRef<Konva.Group>(null);
  const { saveHistory, updateNode, selectNode, selectedNode, selectedGroup, overrideNodeData, groupRelease } =
    useNodeListContext();
  const handleSocketEvent = useSocketStore.getState().handleSocketEvent;
  const [isEditing, setIsEditing] = useState(false);

  useWindowEventListener("keydown", (e) => {
    if (e.code === "Enter" && selectedNode.nodeId === node.id) {
      setIsEditing(!isEditing);
    }
  });

  function handleDoubleClick() {
    setIsEditing(true);
  }

  function handleDragStart(e: Konva.KonvaEventObject<DragEvent>) {
    e.evt.preventDefault();
    saveOffsets(data, node);
  }

  function handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    e.evt.preventDefault();
    const targetId = e.target.getParent().attrs.id;
    const isInSelectedGroup = selectedGroup.some((selectedNode) => selectedNode === targetId);
    if (!isInSelectedGroup) groupRelease();
  }

  function handleDragEnd() {
    resetSavedOffsets();

    handleSocketEvent({
      actionType: "updateNode",
      payload: data,
      callback: () => {
        saveHistory(JSON.stringify(data));
      },
    });
  }

  function handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
    e.evt.preventDefault();
    if (selectedNode.nodeId === node.id) {
      selectNode({ nodeId: 0, parentNodeId: 0, addTo: "canvas" });
      return;
    }
    selectNode({ nodeId: node.id, parentNodeId: parentNode ? parentNode.id : null, addTo: "canvas" });
  }

  const NodeStroke = selectedGroup.includes(node.id.toString()) ? "red" : "";

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    const currentPos = { x: e.target.x(), y: e.target.y() };
    const dx = currentPos.x - node.location.x;
    const dy = currentPos.y - node.location.y;

    if (selectedGroup.length) {
      const groupMove = getMovedNodesLocation(data, selectedGroup, node, dx, dy, currentPos);
      overrideNodeData(groupMove);
      return;
    }

    updateNode(node.id, {
      ...node,
      location: currentPos,
    });

    if (e.evt.shiftKey) {
      checkFollowing(data, node, currentPos, updateNode);
    }
  };

  return (
    <>
      <Group
        ref={nodeRef}
        onDblClick={handleDoubleClick}
        name="node"
        id={node.id.toString()}
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        draggable={!dragmode}
        x={node.location.x}
        y={node.location.y}
        onClick={handleClick}
      >
        <Circle
          stroke={NodeStroke}
          fill={selectedNode?.nodeId === node.id ? "orange" : colors[depth - 1]}
          width={NODE_WIDTH_AND_HEIGHT}
          height={NODE_WIDTH_AND_HEIGHT}
          strokeWidth={3}
          radius={NODE_RADIUS(depth)}
          shadowBlur={5}
        />
        <EditableText
          id={node.id}
          name="text"
          text={node.keyword}
          offsetX={TEXT_OFFSET_X(depth)}
          offsetY={TEXT_OFFSET_Y(depth)}
          width={TEXT_WIDTH(depth)}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        <NodeTool
          offset={{ x: TOOL_OFFSET_X + 9, y: TOOL_OFFSET_Y(NODE_RADIUS(depth)) }}
          visible={selectedNode.nodeId === node.id}
          handleEdit={() => {
            selectNode({});
            setIsEditing(true);
          }}
          handleAdd={() =>
            addNode(data, { nodeId: node.id, parentNodeId: node.id ?? null, addTo: "canvas" }, overrideNodeData)
          }
          handleDelete={() => deleteNodes(JSON.stringify(data), node.id, overrideNodeData)}
        />
      </Group>
    </>
  );
}

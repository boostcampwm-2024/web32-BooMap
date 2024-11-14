import EditableText from "@/konva_mindmap/components/EditableText";
import { Node, NodeData } from "@/konva_mindmap/types/Node";
import { Circle, Group } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useState } from "react";

type NodeProps = {
  data: NodeData;
  parentNode?: Node;
  node: Node;
  depth: number;
};

const colors = ["skyblue", "lightgreen", "lightcoral"];

export default function MindMapNode({ data, parentNode, node, depth }: NodeProps) {
  const { saveHistory, updateNode, selectNode, selectedNode } = useNodeListContext();
  const [isEditing, setIsEditing] = useState(false);

  function handleDoubleClick() {
    setIsEditing(true);
  }

  function handleMouseEnter() {
    this.setStroke("red");
  }

  function handleMouseLeave() {
    this.setStroke("");
  }

  function handleClick() {
    if (selectedNode.nodeId === node.id) {
      selectNode({ nodeId: 0, parentNodeId: 0 });
      return;
    }
    selectNode({ nodeId: node.id, parentNodeId: parentNode ? parentNode.id : null });
  }
  return (
    <Group
      onDblClick={handleDoubleClick}
      name="node"
      id={node.id.toString()}
      onDragMove={(e) => {
        updateNode(node.id, {
          ...node,
          location: {
            x: e.target.x(),
            y: e.target.y(),
          },
        });
      }}
      onDragEnd={() => saveHistory(JSON.stringify(data))}
      draggable
      x={node.location.x}
      y={node.location.y}
      onClick={handleClick}
    >
      <Circle
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        fill={selectedNode?.nodeId === node.id ? "orange" : colors[depth - 1]}
        width={100}
        height={100}
        strokeWidth={3}
        radius={60 - depth * 10}
        shadowBlur={5}
      />
      <EditableText
        id={node.id}
        name="text"
        text={node.keyword}
        offsetX={70 - depth * 10}
        offsetY={8 * depth - 60}
        width={140 - depth * 20}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </Group>
  );
}

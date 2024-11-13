import { Node, NodeData } from "@/types/Node";
import { ConnectedLine } from "@/konva_mindmap/ConnectedLine";
import { Circle, Group } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useState } from "react";
import EditableText from "./EditableText";

type NodeProps = {
  parentNode?: Node;
  node: Node;
  depth: number;
  text: string;
};

const colors = ["skyblue", "lightgreen", "lightcoral"];

function NodeComponent({ parentNode, node, depth, text }: NodeProps) {
  const { updateNodeList } = useNodeListContext();
  const [isEditing, setIsEditing] = useState(false);

  function handleDoubleClick() {
    setIsEditing(true);
  }

  const { updateNode, selectNode, selectedNode } = useNodeListContext();
  return (
    <>
      {parentNode && (
        <ConnectedLine
          from={parentNode.location}
          to={node.location}
          fromRadius={70 - depth * 10}
          toRadius={60 - depth * 10}
        />
      )}
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
        onDragEnd={(e) =>
          updateNode(node.id, {
            ...node,
            location: {
              x: e.target.x(),
              y: e.target.y(),
            },
          })
        }
        draggable
        x={node.location.x}
        y={node.location.y}
        onClick={() => selectNode({ nodeId: node.id, parentNodeId: parentNode ? parentNode.id : null })}
      >
        <Circle fill={colors[depth - 1]} width={100} height={100} radius={60 - depth * 10} />
        <EditableText
          id={node.id}
          name="text"
          text={text}
          offsetX={70 - depth * 10}
          offsetY={8 * depth - 60}
          width={140 - depth * 20}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </Group>
    </>
  );
}

type DrawNodeProps = {
  data: NodeData;
  root: Node;
  depth?: number;
  parentNode?: any;
  update?: (id: number, node: Node) => void;
};

export function DrawNodefromData({ data, root, depth = 0, parentNode }: DrawNodeProps) {
  return (
    <>
      <NodeComponent text={root.keyword} depth={depth} parentNode={parentNode} node={root} />
      {root.children?.map((childNode, index) => (
        <DrawNodefromData data={data} key={index} root={data[childNode]} depth={depth + 1} parentNode={root} />
      ))}
    </>
  );
}

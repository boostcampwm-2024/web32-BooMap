import { Node } from "@/types/Node";
import { ConnectedLine } from "@/utils/konva_mindmap/ConnectedLine";
import { useEffect, useState } from "react";
import { Circle, Group, Layer, Line, Stage, Text } from "react-konva";

// NodeComponent는 단일 노드를 렌더링합니다.
type NodeProps = {
  x: number;
  y: number;
  depth: number;
  text: string;
  setNodeLocation?: any;
};

function NodeComponent({ x, y, depth, text, setNodeLocation }: NodeProps) {
  return (
    <Group
      onDragMove={(e) => {
        setNodeLocation({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onDragEnd={(e) =>
        setNodeLocation({
          x: e.target.x(),
          y: e.target.y(),
        })
      }
    >
      <Circle
        draggable
        x={x}
        y={y}
        fill={"white"}
        width={100}
        height={100}
        radius={70 - depth * 10}
        stroke="black"
        strokeWidth={3}
      />
      <Text text={text} x={x - 20} y={y - 10} />
    </Group>
  );
}

type DrawNodeProps = {
  root: Node;
  x: number;
  y: number;
  depth?: number;
  parentPosition?: any;
  update?: () => void;
};

export function DrawNodefromData({ root, x, y, depth = 0, parentPosition, update }: DrawNodeProps) {
  const [nodeLocation, setNodeLocation] = useState(root.location);
  const nodeSpacing = 150;
  useEffect(() => {
    console.log(nodeLocation);
  }, [nodeLocation]);
  return (
    <>
      {parentPosition && (
        <ConnectedLine
          from={parentPosition}
          to={nodeLocation}
          fromRadius={70 - (depth - 1) * 10 + 10}
          toRadius={70 - depth * 10 + 10}
        />
      )}
      {/* from */}
      <NodeComponent
        x={nodeLocation.x}
        y={nodeLocation.y}
        text={root.content}
        depth={depth}
        setNodeLocation={setNodeLocation}
      />
      {/* to */}
      {root.children?.map((childNode, index) => (
        <DrawNodefromData
          key={childNode.id}
          root={childNode}
          x={nodeLocation.x + (index - root.children!.length / 2) * nodeSpacing}
          y={nodeLocation.y + nodeSpacing}
          depth={depth + 1}
          parentPosition={nodeLocation}
          update={update}
        />
      ))}
    </>
  );
}

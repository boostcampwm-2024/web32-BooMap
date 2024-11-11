import { Node } from "@/types/Node";
import { ConnectedLine } from "@/konva_mindmap/ConnectedLine";
import { Circle, Text } from "react-konva";

type NodeProps = {
  parentNode?: Node;
  node: Node;
  depth: number;
  text: string;
  updateNode: (id: number, updatedNode: Node) => void;
};

function NodeComponent({ parentNode, node, depth, text, updateNode }: NodeProps) {
  return (
    <>
      <Circle
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
        fill={"white"}
        width={100}
        height={100}
        radius={70 - depth * 10}
        stroke="black"
        strokeWidth={3}
      />
      <Text name="text" text={text} x={node.location.x - 20} y={node.location.y - 10} />
      {parentNode && (
        <ConnectedLine
          from={parentNode.location}
          to={node.location}
          fromRadius={70 - (depth - 1) * 10 + 10}
          toRadius={70 - depth * 10 + 10}
        />
      )}
    </>
  );
}

type DrawNodeProps = {
  data: Node[];
  root: Node;
  depth?: number;
  parentNode?: any;
  update?: (id: number, node: Node) => void;
};

export function DrawNodefromData({ data, root, depth = 0, parentNode, update }: DrawNodeProps) {
  return (
    <>
      {/* from */}
      <NodeComponent text={root.keyword} depth={depth} parentNode={parentNode} node={root} updateNode={update} />
      {/* to */}
      {root.children?.map((childNode, index) => (
        <DrawNodefromData
          data={data}
          key={index}
          root={data[childNode - 1]}
          depth={depth + 1}
          parentNode={root}
          update={update}
        />
      ))}
    </>
  );
}

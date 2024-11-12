import { Node, NodeData } from "@/types/Node";
import { ConnectedLine } from "@/konva_mindmap/ConnectedLine";
import { Circle, Group, Text } from "react-konva";
import { useNodeListContext } from "@/store/NodeListProvider";

type NodeProps = {
  parentNode?: Node;
  node: Node;
  depth: number;
  text: string;
};

function NodeComponent({ parentNode, node, depth, text }: NodeProps) {
  const { updateNodeList } = useNodeListContext();
  return (
    <>
      <Group
        name="node"
        id={node.id.toString()}
        onDragMove={(e) => {
          updateNodeList(node.id, {
            ...node,
            location: {
              x: e.target.x(),
              y: e.target.y(),
            },
          });
        }}
        onDragEnd={(e) =>
          updateNodeList(node.id, {
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
      >
        <Circle fill={"white"} width={100} height={100} radius={70 - depth * 10} stroke="black" strokeWidth={3} />
        <Text name="text" text={text} />
      </Group>
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
  data: NodeData;
  root: Node;
  depth?: number;
  parentNode?: any;
  update?: (id: number, node: Node) => void;
};

export function DrawNodefromData({ data, root, depth = 0, parentNode }: DrawNodeProps) {
  return (
    <>
      {/* from */}
      <NodeComponent text={root.keyword} depth={depth} parentNode={parentNode} node={root} />
      {/* to */}
      {root.children?.map((childNode, index) => (
        <DrawNodefromData data={data} key={index} root={data[childNode]} depth={depth + 1} parentNode={root} />
      ))}
    </>
  );
}

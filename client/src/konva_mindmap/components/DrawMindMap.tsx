import MindMapNode from "@/konva_mindmap/components/MindMapNode";
import ConnectedLine from "@/konva_mindmap/components/ConnectedLine";
import { Node, NodeData } from "@/types/Node";
import React from "react";

type MindMapProps = {
  data: NodeData;
  root: Node;
  depth?: number;
  parentNode?: any;
  update?: (id: number, node: Node) => void;
};

export default function DrawMindMap({ data, root, depth = 0, parentNode }: MindMapProps) {
  return (
    <>
      <MindMapNode data={data} depth={depth} parentNode={parentNode} node={root} />
      {root.children?.map((childNode, index) => (
        <React.Fragment key={index}>
          <ConnectedLine
            from={root.location}
            to={data[childNode].location}
            fromRadius={70 - (depth + 1) * 10}
            toRadius={60 - (depth + 1) * 10}
          />
          <DrawMindMap data={data} root={data[childNode]} depth={depth + 1} parentNode={root} />
        </React.Fragment>
      ))}
    </>
  );
}

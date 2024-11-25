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
  dragmode: boolean;
};

export default function DrawMindMap({ data, root, depth = 0, parentNode, dragmode }: MindMapProps) {
  return (
    <>
      {parentNode && (
        <ConnectedLine
          from={parentNode.location}
          to={root.location}
          fromRadius={70 - depth * 10}
          toRadius={60 - depth * 10}
        />
      )}
      <MindMapNode data={data} depth={depth} parentNode={parentNode} node={root} dragmode={dragmode} />
      {root.children?.map((childNode, index) => (
        <React.Fragment key={index}>
          <DrawMindMap data={data} root={data[childNode]} depth={depth + 1} parentNode={root} dragmode={dragmode} />
        </React.Fragment>
      ))}
    </>
  );
}

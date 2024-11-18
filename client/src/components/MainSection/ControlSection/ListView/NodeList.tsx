import NodeItem from "@/components/MainSection/ControlSection/ListView/NodeItem";
import useAccordion from "@/hooks/useAccordion";
import { useNodeListContext } from "@/store/NodeListProvider";
import { NodeData } from "@/types/Node";
import { useEffect } from "react";

type NodeListProps = {
  data: NodeData;
  parentNodeId?: number;
  id: number;
};

export default function NodeList({ data, parentNodeId, id }: NodeListProps) {
  const nodeData = data[id];
  const { open, handleAccordion, openAccordion } = useAccordion();

  return (
    <div className="flex h-full flex-col gap-2">
      <NodeItem
        id={id}
        parentNodeId={parentNodeId}
        content={nodeData.keyword}
        depth={nodeData.depth}
        handleAccordion={handleAccordion}
        open={open}
        openAccordion={openAccordion}
      />
      {open &&
        nodeData.children.map((childId) => {
          return <NodeList key={childId} data={data} parentNodeId={id} id={childId} />;
        })}
    </div>
  );
}

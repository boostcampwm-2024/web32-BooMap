import NodeItem from "@/components/MindMapMainSection/ControlSection/ListView/NodeItem";
import useAccordion from "@/hooks/useAccordion";
import { Node, NodeData } from "@/types/Node";

type NodeListProps = {
  data: NodeData;
  parentNodeId?: number;
  root: Node;
};

export default function NodeList({ data, parentNodeId, root }: NodeListProps) {
  const { open, handleAccordion, openAccordion } = useAccordion();

  return (
    <div className="flex h-full flex-col gap-2">
      <NodeItem
        node={root}
        parentNodeId={parentNodeId}
        handleAccordion={handleAccordion}
        open={open}
        openAccordion={openAccordion}
      />
      {open &&
        root.children.map((childId) => {
          return <NodeList key={childId} data={data} parentNodeId={root.id} root={data[childId]} />;
        })}
    </div>
  );
}

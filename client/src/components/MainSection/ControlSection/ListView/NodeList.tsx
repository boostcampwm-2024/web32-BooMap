import NodeItem from "@/components/MainSection/ControlSection/ListView/NodeItem";
import useAccordian from "@/hooks/useAccordian";
import {} from "@/store/NodeListProvider";
import { NodeData } from "@/types/Node";

type NodeListProps = {
  data: NodeData;
  id: number;
};

export default function NodeList({ data, id }: NodeListProps) {
  const nodeData = data[id];
  const { open, handleAccordian } = useAccordian();

  return (
    <div className="flex h-full flex-col gap-2">
      <NodeItem content={nodeData.keyword} depth={nodeData.depth} handleAccordian={handleAccordian} open={open} />

      {open &&
        nodeData.children.map((childId) => {
          return <NodeList key={childId} data={data} id={childId} />;
        })}
    </div>
  );
}

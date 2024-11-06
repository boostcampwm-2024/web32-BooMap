import NodeItem from "@/components/MainSection/ControlSection/ListView/NodeItem";
import useAccordian from "@/hooks/useAccordian";
import { NodeListContextType } from "@/store/NodeListProvider";

type NodeListProps = NodeListContextType & {
  depth?: number;
};

export default function NodeList({ data, depth = 1, updateNodeList }: NodeListProps) {
  const nodeDepth = depth;
  const { open, handleAccordian } = useAccordian();

  return (
    <div className="flex h-full flex-col gap-2">
      {data && <NodeItem content={data.content} depth={nodeDepth} handleAccordian={handleAccordian} open={open} />}
      {open &&
        data?.children.map((node) => {
          return <NodeList data={node} depth={nodeDepth + 1} updateNodeList={updateNodeList} />;
        })}
    </div>
  );
}

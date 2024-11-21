import NodeList from "@/components/MindMapMainSection/ControlSection/ListView/NodeList";
import { useNodeListContext } from "@/store/NodeListProvider";
import { Node } from "@/types/Node";

export default function ListView() {
  const { data } = useNodeListContext();
  if (!Object.keys(data).length) return <p>새로운 브레인스토밍을 시작해보세요</p>;
  const root: Node = data[Object.keys(data)[0]];

  return <div>{Object.keys(data).length >= 1 && <NodeList data={data} root={root} />}</div>;
}

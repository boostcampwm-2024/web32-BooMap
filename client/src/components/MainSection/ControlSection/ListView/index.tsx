import NodeList from "@/components/MainSection/ControlSection/ListView/NodeList";
import { useNodeListContext } from "@/store/NodeListProvider";

export default function ListView() {
  const { data } = useNodeListContext();

  if (!data) return <p>데이터가 없습니다. 새롭게 추가해주세요!</p>;

  return <div>{Object.keys(data).length >= 1 && <NodeList data={data} id={1} />}</div>;
}

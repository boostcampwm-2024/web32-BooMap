import NodeList from "@/components/MainSection/ControlSection/ListView/NodeList";
import { useNodeListContext } from "@/store/NodeListProvider";

export default function ListView() {
  const { data, updateNodeList } = useNodeListContext();

  if (!data) return <p>데이터가 없습니다. 새롭게 추가해주세요!</p>;

  return <NodeList data={data} updateNodeList={updateNodeList} />;
}

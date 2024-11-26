import MindMapCanvas from "@/components/MindMapCanvas";
import ControlSection from "@/components/MindMapMainSection/ControlSection";
import Minutes from "@/components/Minutes";
import useMinutes from "@/hooks/useMinutes";
import Spinner from "../common/Spinner";
import { useNodeListContext } from "@/store/NodeListProvider";

export default function MindMapView() {
  const { showMinutes, handleShowMinutes, isAnimating, handleIsAnimating } = useMinutes();
  const { loading } = useNodeListContext();

  return (
    <>
      {loading && <Spinner />}
      <ControlSection />
      <MindMapCanvas showMinutes={showMinutes} handleShowMinutes={handleShowMinutes} />
      <Minutes showMinutes={showMinutes} isAnimating={isAnimating} handleIsAnimating={handleIsAnimating} />
    </>
  );
}

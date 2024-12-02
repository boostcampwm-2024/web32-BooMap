import MindMapCanvas from "@/components/MindMapCanvas";
import ControlSection from "@/components/MindMapMainSection/ControlSection";
import Minutes from "@/components/Minutes";
import useMinutes from "@/hooks/useMinutes";
import Spinner from "../common/Spinner";
import { useNodeListContext } from "@/store/NodeListProvider";
import { createPortal } from "react-dom";
import AiSpinner from "@/components/common/aiSpinner";

export default function MindMapView() {
  const { showMinutes, handleShowMinutes, isAnimating, handleIsAnimating } = useMinutes();
  const { loadingStatus } = useNodeListContext();

  return (
    <>
      {loadingStatus.socketLoading && createPortal(<Spinner />, document.body)}
      {loadingStatus.aiPending && createPortal(<AiSpinner />, document.body)}
      <ControlSection />
      <MindMapCanvas showMinutes={showMinutes} handleShowMinutes={handleShowMinutes} />
      <Minutes showMinutes={showMinutes} isAnimating={isAnimating} handleIsAnimating={handleIsAnimating} />
    </>
  );
}

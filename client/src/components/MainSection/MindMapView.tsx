import ControlSection from "@/components/MainSection/ControlSection";
import MindMapCanvas from "@/components/MindMapCanvas";
import Minutes from "@/components/Minutes";
import useMinutes from "@/hooks/useMinutes";

export default function MindMapView() {
  const { showMinutes, handleShowMinutes, isAnimating, handleIsAnimating } = useMinutes();

  return (
    <>
      <ControlSection />
      <MindMapCanvas showMinutes={showMinutes} handleShowMinutes={handleShowMinutes} />
      <Minutes showMinutes={showMinutes} isAnimating={isAnimating} handleIsAnimating={handleIsAnimating} />
    </>
  );
}

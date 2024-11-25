import MindMapCanvas from "@/components/MindMapCanvas";
import ControlSection from "@/components/MindMapMainSection/ControlSection";
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

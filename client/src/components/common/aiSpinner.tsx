import robot from "@/assets/lottie/robot.json";
import Lottie from "lottie-react";

export default function AiSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="translate-x-50 translate-y-50 absolute flex h-96 w-96 flex-col items-center">
        <Lottie animationData={robot} autoplay loop />
        <p className="text-xl font-bold">AI가 회의록을 마인드맵으로 변환하고 있어요</p>
      </div>
    </div>
  );
}

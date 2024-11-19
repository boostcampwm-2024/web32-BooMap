import notFoundIcon from "@/assets/notFound.png";
import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gap-6">
      <img className="w-96" src={notFoundIcon} alt="notfound" />
      <div className="flex-center flex flex-col items-center">
        <p className="text-[100px] text-white">OOPS!</p>
        <p className="text-2xl text-grayscale-300">무언가 잘못됐어요</p>
        <Button className="mt-10 rounded-lg bg-bm-blue px-4 py-2" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}

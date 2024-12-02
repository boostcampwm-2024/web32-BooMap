import MindMapHeader from "@/components/MindMapHeader";
import MindMapView from "@/components/MindMapMainSection/MindMapView";
import useSection from "@/hooks/useSection";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ToastContainer from "../common/Toast/ToastContainer";
import { useConnectionStore } from "@/store/useConnectionStore";

const modeView = {
  voiceupload: "음성 파일 업로드",
  listview: "리스트 보기",
  textupload: "텍스트 형식으로 업로드",
};

export default function MindMapMainSection() {
  const mode = useSection().searchParams.get("mode") as keyof typeof modeView;
  const { mindMapId } = useParams<{ mindMapId: string }>();
  const connectSocket = useConnectionStore((state) => state.connectSocket);
  const disconnectSocket = useConnectionStore((state) => state.disconnectSocket);
  const wsError = useConnectionStore((state) => state.wsError);
  const [toasts, setToasts] = useState([]);
  const token = useConnectionStore((state) => state.token);

  useEffect(() => {
    if (wsError.length > 0)
      setToasts((prevToasts) => [
        ...prevToasts,
        { id: new Date().getTime(), message: wsError[wsError.length - 1], status: "fail" },
      ]);
  }, [wsError]);

  useEffect(() => {
    if (mindMapId) {
      connectSocket(mindMapId, token);
    }
    return () => {
      disconnectSocket();
    };
  }, [mindMapId, connectSocket, disconnectSocket]);

  return (
    <>
      <MindMapHeader />
      <main className="flex h-[90%] w-full flex-col overflow-hidden p-8">
        <p className="p-3 text-2xl font-bold">{modeView[mode] || modeView.listview}</p>
        <div className="relative flex h-[90%] w-full gap-4">
          <MindMapView />
          <ToastContainer toasts={toasts} setToasts={setToasts} />
        </div>
      </main>
    </>
  );
}

import { useState } from "react";

export type MindMapLoadingHook = {
  loadingStatus: MindMapLoading;
  updateLoadingStatus: ({ type, status }: { type: "aiPending" | "socketLoading"; status: boolean }) => void;
};

type MindMapLoading = {
  aiPending: boolean;
  socketLoading: boolean;
};
export default function useLoading(): MindMapLoadingHook {
  const [loadingStatus, setLoadingStatus] = useState<MindMapLoading>({
    aiPending: false,
    socketLoading: false,
  });

  function updateLoadingStatus({ type, status }: { type: "aiPending" | "socketLoading"; status: boolean }) {
    if (type === "aiPending") setLoadingStatus((prev) => ({ ...prev, aiPending: status }));
    else setLoadingStatus((prev) => ({ ...prev, socketLoading: status }));
  }
  return {
    loadingStatus,
    updateLoadingStatus,
  };
}

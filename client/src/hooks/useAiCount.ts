import { useState } from "react";

export type AiCountHook = {
  aiCount: number;
  initializeAiCount: (initialData) => void;
  decreaseAiCount: () => void;
};

export default function useAiCount(): AiCountHook {
  const [aiCount, setAiCount] = useState<number>(0);

  function initializeAiCount(initialData) {
    setAiCount(parseInt(initialData.aiCount));
  }

  function decreaseAiCount() {
    setAiCount((prev) => prev - 1);
  }
  return {
    aiCount,
    initializeAiCount,
    decreaseAiCount,
  };
}

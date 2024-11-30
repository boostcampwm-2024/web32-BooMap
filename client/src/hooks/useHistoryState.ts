import { useConnectionStore } from "@/store/useConnectionStore";
import { useState, useCallback } from "react";

export default function useHistoryState<T>(data: string) {
  const [history, setHistory] = useState([data]);
  const [pointer, setPointer] = useState(0);
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);

  const saveHistory = useCallback(
    (data: string) => {
      setHistory((prevHistory) => [...prevHistory.slice(0, pointer + 1), data]);
      setPointer((p) => p + 1);
    },
    [pointer],
  );

  const overrideHistory = useCallback(
    (data: string) => {
      setHistory([data]);
      setPointer(0);
    },
    [pointer],
  );

  const undo = useCallback(
    (setData) => {
      if (!history[0] || pointer <= 0) return;
      const parsedData = JSON.parse(history[pointer - 1]);
      handleSocketEvent({
        actionType: "updateNode",
        payload: parsedData,
        callback: () => {
          setData(parsedData);
          setPointer((p) => p - 1);
        },
      });
    },
    [history, pointer],
  );

  const redo = useCallback(
    (setData) => {
      if (pointer >= history.length - 1) return;
      const parsedData = JSON.parse(history[pointer + 1]);
      handleSocketEvent({
        actionType: "updateNode",
        payload: parsedData,
        callback: () => {
          setData(parsedData);
          setPointer((p) => p + 1);
        },
      });
    },
    [history, pointer],
  );

  return { saveHistory, overrideHistory, undo, redo, history };
}

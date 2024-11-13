import { NodeData } from "@/types/Node";
import { useState, useCallback } from "react";

export default function useHistoryState<T>(initialState: T) {
  const [history, setHistory] = useState([initialState]);
  const [pointer, setPointer] = useState(0);

  const saveHistory = useCallback(
    (data: T) => {
      const newHistory = [...history.slice(0, pointer + 1), data];
      setPointer(newHistory.length - 1);
      setHistory(newHistory);
    },
    [pointer, history],
  );

  const undo = useCallback(
    (setData) => {
      if (pointer <= 0) return;
      setPointer((p) => p - 1);
      setData(history[pointer - 1]);
    },
    [history, pointer],
  );

  const redo = useCallback(
    (setData) => {
      if (pointer >= history.length - 1) return;
      setPointer((p) => p + 1);
      setData(history[pointer + 1]);
    },
    [history, pointer],
  );

  return { saveHistory, undo, redo };
}

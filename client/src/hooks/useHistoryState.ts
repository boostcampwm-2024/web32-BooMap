import { useState, useCallback, useEffect } from "react";

export default function useHistoryState<T>(initialState: T) {
  const [data, _setData] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [pointer, setPointer] = useState(0);

  const setData = useCallback((newState) => _setData(newState), [pointer, history]);

  const saveHistory = useCallback(() => {
    const newHistory = [...history.slice(0, pointer + 1), data];
    setPointer(newHistory.length - 1);
    setHistory(newHistory);
  }, [pointer, history]);

  const undo = useCallback(() => {
    if (pointer <= 0) return;
    setPointer((p) => p - 1);
    _setData(history[pointer - 1]);
  }, [history, pointer]);

  const redo = useCallback(() => {
    if (pointer >= history.length - 1) return;
    setPointer((p) => p + 1);
    _setData(history[pointer + 1]);
  }, [history, pointer]);

  return { data, setData, saveHistory, undo, redo };
}

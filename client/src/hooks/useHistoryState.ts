import { SocketSlice } from "@/store/SocketSlice";
import { useState, useCallback, useEffect } from "react";

export default function useHistoryState<T>(data: string) {
  const [history, setHistory] = useState([data]);
  const [pointer, setPointer] = useState(0);
  const socket = SocketSlice.getState().socket;

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
      if (socket) {
        socket.emit("updateNode", parsedData);
        socket.on("updateNode", (response) => {
          if (response) {
            setData(parsedData);
            setPointer((p) => p - 1);
          }
        });
      }
    },
    [history, pointer],
  );

  const redo = useCallback(
    (setData) => {
      if (pointer >= history.length - 1) return;
      if (socket) {
        const parsedData = JSON.parse(history[pointer + 1]);
        socket.emit("updateNode", parsedData);
        socket.on("updateNode", (response) => {
          if (response) {
            setPointer((p) => p + 1);
            setData(parsedData);
          }
        });
      }
    },
    [history, pointer],
  );

  return { saveHistory, overrideHistory, undo, redo, history };
}

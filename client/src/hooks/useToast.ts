import { useEffect, useState } from "react";
import { useConnectionStore } from "@/store/useConnectionStore";

export default function useToast() {
  const wsError = useConnectionStore((state) => state.wsError);
  const nodeError = useConnectionStore((state) => state.nodeError);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (wsError.length > 0) {
      setToasts((prevToasts) => [
        ...prevToasts,
        { id: new Date().getTime(), message: wsError[wsError.length - 1], status: "fail" },
      ]);
    }
  }, [wsError]);

  useEffect(() => {
    if (nodeError.length > 0) {
      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id: new Date().getTime(),
          message: nodeError[nodeError.length - 1].message,
          status: nodeError[nodeError.length - 1].status,
        },
      ]);
    }
  }, [nodeError]);

  return { toasts, setToasts };
}

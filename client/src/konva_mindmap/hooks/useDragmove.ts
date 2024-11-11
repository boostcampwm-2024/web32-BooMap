import { useEffect } from "react";

export default function useLayerEvent(ref, event, eventHandler) {
  useEffect(() => {
    ref.current.on(event, eventHandler);
  }, []);
}

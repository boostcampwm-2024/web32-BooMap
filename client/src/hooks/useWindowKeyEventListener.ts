import { useEffect } from "react";

export default function useWindowKeyEventListener(eventType: string, eventHandler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    window.addEventListener(eventType, eventHandler);
    return () => {
      window.removeEventListener(eventType, eventHandler);
    };
  }, [eventType, eventHandler]);
}

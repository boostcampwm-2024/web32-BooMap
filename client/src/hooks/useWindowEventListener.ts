import { useEffect } from "react";

export default function useWindowEventListener<T extends keyof WindowEventMap>(
  eventType: T,
  eventHandler: (event: WindowEventMap[T]) => void,
) {
  useEffect(() => {
    window.addEventListener(eventType, eventHandler as EventListener);
    return () => {
      window.removeEventListener(eventType, eventHandler as EventListener);
    };
  }, [eventType, eventHandler]);
}

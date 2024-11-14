import Konva from "konva";
import { useEffect, useRef } from "react";

type useLayerEventProps = [eventName: string, eventHandler: () => void][];

export default function useLayerEvent(events: useLayerEventProps) {
  const layer = useRef<Konva.Layer>();
  useEffect(() => {
    events.forEach(([eventName, eventHandler]) => {
      layer.current?.on(eventName, eventHandler);
    });
    return () => {
      events.forEach(([eventName, eventHandler]) => {
        layer.current?.off(eventName, eventHandler);
      });
    };
  }, []);
  return layer;
}

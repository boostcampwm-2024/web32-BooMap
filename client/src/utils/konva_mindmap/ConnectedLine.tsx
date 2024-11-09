import { Location } from "@/utils/konva_mindmap/types/location";
import { getLinePoints } from "@/utils/konva_mindmap/utils/points";
import { Line } from "react-konva";

type ConnectedLineProps = {
  from: Location;
  to: Location;
  fromRadius: number;
  toRadius: number;
};

export function ConnectedLine({ from, to, fromRadius, toRadius }: ConnectedLineProps) {
  return <Line points={getLinePoints(from, to, fromRadius, toRadius)} stroke="gray" strokeWidth={2} />;
}

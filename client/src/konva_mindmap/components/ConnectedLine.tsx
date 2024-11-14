import { Location } from "@/konva_mindmap/types/location";
import { getLinePoints } from "@/konva_mindmap/utils/points";
import { Line } from "react-konva";

type ConnectedLineProps = {
  from: Location;
  to: Location;
  fromRadius: number;
  toRadius: number;
};

export default function ConnectedLine({ from, to, fromRadius, toRadius }: ConnectedLineProps) {
  return <Line name="line" points={getLinePoints(from, to, fromRadius, toRadius)} stroke="gray" strokeWidth={2} />;
}

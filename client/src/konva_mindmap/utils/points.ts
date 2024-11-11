import { Location } from "@/konva_mindmap/types/location";

// from 원의 중점에서 to 원의 중점으로 이어지는 선에서 from 선의 위치를 원의 중점이 아닌 가장자리의 위치 구하는 함수
export function getCircleEdgePoint(from: Location, to: Location, fromRadius: number, toRadius: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const vector = Math.sqrt(dx * dx + dy * dy);
  if (fromRadius + toRadius > vector) {
    return {
      xEdgePoint: 0,
      yEdgePoint: 0,
    };
  }

  const xEdgePoint = Math.ceil(from.x + (fromRadius * dx) / vector);
  const yEdgePoint = Math.ceil(from.y + (fromRadius * dy) / vector);

  return {
    xEdgePoint,
    yEdgePoint,
  };
}

// Point의 인자로 만들어주는 함수
// 각각의 원에 대해서 가장자리 쪽으로 갈 수 있게끔 해줌
export function getLinePoints(from: Location, to: Location, fromRadius: number, toRadius: number) {
  const fromCircleEdgePoint = getCircleEdgePoint(from, to, fromRadius, toRadius);
  const toCircleEdgePoint = getCircleEdgePoint(to, from, toRadius, fromRadius);
  return [
    fromCircleEdgePoint.xEdgePoint,
    fromCircleEdgePoint.yEdgePoint,
    toCircleEdgePoint.xEdgePoint,
    toCircleEdgePoint.yEdgePoint,
  ];
}

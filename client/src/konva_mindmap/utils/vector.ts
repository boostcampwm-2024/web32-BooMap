import { Location } from "@/konva_mindmap/types/location";

// 두 점 사이의 벡터 구하기
export function vector(a: Location, b: Location) {
  return { x: b.x - a.x, y: b.y - a.y };
}

export function perpendicularVector(a: Location, b: Location) {
  return { x: a.y - b.y, y: b.x - a.x };
}

export function unitVector(a: Location, b: Location) {
  const v = perpendicularVector(a, b);
  const vectorLength = Math.sqrt(v.x ** 2 + v.y ** 2);
  return { x: v.x / vectorLength, y: v.y / vectorLength };
}

// import { describe, it, expect } from "vitest";
// import { Location } from "@/konva_mindmap/types/location";
// import { getCircleEdgePoint, getLinePoints } from "@/konva_mindmap/utils/points";

// // 테스트용 데이터
// const from: Location = { x: Math.random() * 100, y: Math.random() * 100 };
// const to: Location = { x: Math.random() * 100, y: Math.random() * 100 };
// const fromRadius = Math.random() * 50;
// const toRadius = Math.random() * 50;

// describe("ConnectedLine 유틸리티 함수", () => {
//   it("getCircleEdgePoint가 가장자리 포인트를 올바르게 계산해야 함", () => {
//     const edgePoint = getCircleEdgePoint(from, to, fromRadius, toRadius);

//     // 두 원의 반지름이 거리보다 큰 경우 (겹치는 경우) (0,0) 좌표 반환
//     const distance = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
//     if (fromRadius + toRadius > distance) {
//       expect(edgePoint).toEqual({ xEdgePoint: 0, yEdgePoint: 0 });
//     } else {
//       // 겹치지 않는 경우 예상 값 계산
//       const expectedXEdgePoint = Math.ceil(from.x + (fromRadius * (to.x - from.x)) / distance);
//       const expectedYEdgePoint = Math.ceil(from.y + (fromRadius * (to.y - from.y)) / distance);

//       expect(edgePoint.xEdgePoint).toBe(expectedXEdgePoint);
//       expect(edgePoint.yEdgePoint).toBe(expectedYEdgePoint);
//     }
//   });

//   it("getLinePoints는 두 원의 가장자리 포인트를 반환해야 함", () => {
//     const points = getLinePoints(from, to, fromRadius, toRadius);

//     // from과 to에 대해 가장자리 포인트 계산
//     const fromEdge = getCircleEdgePoint(from, to, fromRadius, toRadius);
//     const toEdge = getCircleEdgePoint(to, from, toRadius, fromRadius);

//     expect(points).toEqual([fromEdge.xEdgePoint, fromEdge.yEdgePoint, toEdge.xEdgePoint, toEdge.yEdgePoint]);
//   });
// });

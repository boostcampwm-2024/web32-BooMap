// import { checkCollision, haveIntersection, isCollided, moveOnCollision } from "@/konva_mindmap/utils/collision";
// import { describe, it, expect, vi } from "vitest";
// import Konva from "konva";

// function createMockNode(attrs) {
//   const node = new Konva.Group(attrs);
//   node.attrs = attrs;
//   return node;
// }

// describe("충돌 관련 함수 테스트", () => {
//   it("노드 간 충돌 확인 함수 테스트", () => {
//     const nodeA = createMockNode({ x: 0, y: 0, width: 10, height: 10 });
//     const nodeB = createMockNode({ x: 0, y: 0, width: 15, height: 15 });
//     const nodeC = createMockNode({ x: 20, y: 20, width: 10, height: 10 });
//     expect(isCollided(nodeA, nodeB)).toBe(true);
//     expect(isCollided(nodeA, nodeC)).toBe(false);
//   });

//   it("clientRect의 property를 통해 요소 간 충돌을 확인할 수 있다.", () => {
//     const rect1 = { x: 0, y: 0, width: 10, height: 10 };
//     const rect2 = { x: 5, y: 5, width: 10, height: 10 };
//     const rect3 = { x: 20, y: 20, width: 10, height: 10 };

//     expect(haveIntersection(rect1, rect2)).toBe(true);
//     expect(haveIntersection(rect1, rect3)).toBe(false);
//   });

//   it("충돌했을 경우 움직이는 좌표는 제대로 된 x,y좌표를 리턴한다.", () => {
//     const targetNode = createMockNode({ x: 10, y: 10 });
//     const draggedNode = createMockNode({ x: 0, y: 0 });

//     const newPosition = moveOnCollision(targetNode, draggedNode);
//     expect(newPosition).toMatchObject({
//       x: expect.any(Number),
//       y: expect.any(Number),
//     });
//   });

//   it("checkCollision의 내부 로직을 통해서 조정된 x,y좌표가 setter 함수 안에 들어간 후 실행된다.", () => {
//     const layer = new Konva.Layer();
//     const nodeA = createMockNode({ id: "1", name: "node", x: 0, y: 0, width: 20, height: 20 });
//     const nodeB = createMockNode({ id: "2", name: "node", x: 0, y: 0, width: 40, height: 40 });
//     layer.add(nodeA);
//     layer.add(nodeB);
//     const updateMock = vi.fn();
//     const layerRef = { current: layer };
// it("checkCollision의 내부 로직을 통해서 조정된 x,y좌표가 setter 함수 안에 들어간 후 실행된다.", () => {
//   const layer = new Konva.Layer();
//   const nodeA = createMockNode({ id: "1", name: "node", x: 0, y: 0, width: 20, height: 20 });
//   const nodeB = createMockNode({ id: "2", name: "node", x: 0, y: 0, width: 40, height: 40 });
//   layer.add(nodeA);
//   layer.add(nodeB);
//   const updateMock = vi.fn();
//   const layerRef = { current: layer };

//     checkCollision(layerRef, updateMock);
//   checkCollision(layerRef, updateMock);

//     expect(updateMock).toHaveBeenCalled();
//     expect(updateMock).toHaveBeenCalledWith(2, {
//       location: expect.objectContaining({
//         x: expect.any(Number),
//         y: expect.any(Number),
//       }),
//     });
//   });

//   it("요소들이 충돌되지 않을 경우 노드들의 상태는 업데이트되지 않는다", () => {
//     const layer = new Konva.Layer({
//       current: {
//         children: [
//           createMockNode({ id: "1", name: "node", x: 0, y: 0, width: 20, height: 20 }),
//           createMockNode({ id: "2", name: "node", x: 10, y: 10, width: 40, height: 40 }),
//         ],
//       },
//     });
//   it("요소들이 충돌되지 않을 경우 노드들의 상태는 업데이트되지 않는다", () => {
//     const layer = new Konva.Layer({
//       current: {
//         children: [
//           createMockNode({ id: "1", name: "node", x: 0, y: 0, width: 20, height: 20 }),
//           createMockNode({ id: "2", name: "node", x: 10, y: 10, width: 40, height: 40 }),
//         ],
//       },
//     });

//     const updateMock = vi.fn();
//     const layerRef = { current: layer };

//     checkCollision(layerRef, updateMock);

//     expect(updateMock).not.toHaveBeenCalled();
//   });
// });

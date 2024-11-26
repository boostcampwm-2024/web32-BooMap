import { Location } from "@/konva_mindmap/types/location";
import { Node, NodeData } from "@/types/Node";
import Konva from "konva";

export function getSelectedNodes(layer: Konva.Layer, square) {
  if (!layer) return [];

  const nodes = layer.children.filter((node) => node.attrs.name === "node");

  const rectBounds = {
    x1: square.x,
    y1: square.y,
    x2: square.x + square.width,
    y2: square.y + square.height,
  };

  const selectedNodes = nodes.filter((node) => {
    const nodeCenter = {
      x: node.attrs.x,
      y: node.attrs.y,
    };

    return (
      nodeCenter.x >= rectBounds.x1 &&
      nodeCenter.x <= rectBounds.x2 &&
      nodeCenter.y >= rectBounds.y1 &&
      nodeCenter.y <= rectBounds.y2
    );
  });

  return selectedNodes;
}

export function getMovedNodesLocation(
  data: NodeData,
  selectedGroup,
  node: Node,
  dx: number,
  dy: number,
  currentPos: Location,
) {
  const result = JSON.parse(JSON.stringify(data));
  result[node.id].location = currentPos;
  selectedGroup.forEach((selectedId) => {
    if (selectedId !== node.id.toString()) {
      const selectedNode = result[parseInt(selectedId)];
      result[parseInt(selectedId)].location = {
        x: selectedNode.location.x + dx,
        y: selectedNode.location.y + dy,
      };
    }
  });
  return result;
}

import Konva from "konva";
import { useState } from "react";

export default function useGroupSelect() {
  const [selectedGroup, setSelectedGroup] = useState([]);
  function groupSelect(group: Konva.Group[]) {
    const selectedNodes = group.map((node) => node.attrs.id);
    setSelectedGroup(selectedNodes);
  }
  function groupRelease() {
    setSelectedGroup([]);
  }
  return { groupSelect, groupRelease, selectedGroup };
}

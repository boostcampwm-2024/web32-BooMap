import arrowDown from "@/assets/arrowDown.png";
import plusIcon from "@/assets/plus.png";
import editIcon from "@/assets/pencil.png";
import deleteIcon from "@/assets/trash2.png";
import { Input } from "@headlessui/react";
import useNodeActions from "@/hooks/useNodeActions";
import bulletPointIcon from "@/assets/bulletPoint.png";
import { useNodeListContext } from "@/store/NodeListProvider";
import { deleteNodes } from "@/konva_mindmap/events/deleteNode";
import { showNewNode } from "@/konva_mindmap/events/addNode";
import { useEffect, useRef } from "react";
import { Node } from "@/types/Node";

type NodeItemProps = {
  node: Node;
  parentNodeId?: number;
  open: boolean;
  handleAccordion: () => void;
  openAccordion: () => void;
};

export default function NodeItem({ node, parentNodeId, open, handleAccordion, openAccordion }: NodeItemProps) {
  const {
    hover,
    isEditing,
    setIsEditing,
    keyword,
    handleChangeKeyword,
    handleDoubleClick,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
  } = useNodeActions(node.id, node.keyword);
  const { data, saveHistory, selectedNode, overrideNodeData, selectNode } = useNodeListContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isSelected =
    selectedNode.parentNodeId === node.id || findParentNodeId(selectedNode.parentNodeId, data) === node.id;

  useEffect(() => {
    if (node.newNode) {
      setIsEditing(true);
      inputRef.current?.focus();
    }
  }, [node.id, setIsEditing]);

  useEffect(() => {
    if (isSelected) openAccordion();
  }, [isSelected]);

  function findParentNodeId(nodeId, nodeData) {
    for (const id in nodeData) {
      const node = nodeData[parseInt(id)];
      if (node.children.includes(nodeId)) {
        return node.id;
      }
    }
    return null;
  }

  function handleAddButton() {
    saveHistory(JSON.stringify(data));
    selectNode({ nodeId: node.id, parentNodeId: parentNodeId });
    showNewNode(data, { nodeId: node.id, parentNodeId: parentNodeId }, overrideNodeData);
    openAccordion();
  }

  function handleDeleteButton() {
    saveHistory(JSON.stringify(data));
    deleteNodes(JSON.stringify(data), node.id, overrideNodeData);
  }

  const selectedBorder = selectedNode.nodeId === node.id ? "border-2 border-blue-500" : "border-2 border-grayscale-600";

  return (
    <div
      className={`flex justify-between rounded-xl bg-grayscale-600 p-[10px] ${selectedBorder}`}
      style={{ marginLeft: `${(node.depth - 1) * 30}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {node.depth < 3 ? (
          <button
            className={`flex h-5 w-5 items-center justify-center transition-all ${open ? "" : "rotate-[-90deg]"}`}
            onClick={handleAccordion}
          >
            <img src={arrowDown} alt="열기" className="h-3 w-4" />
          </button>
        ) : (
          <img src={bulletPointIcon} alt="구분점" className="h-2 w-2" />
        )}
        {isEditing ? (
          <Input
            ref={inputRef}
            className="flex-grow bg-transparent text-grayscale-200"
            value={keyword}
            onChange={handleChangeKeyword}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            maxLength={30}
          />
        ) : (
          <span className="flex-grow truncate" onDoubleClick={handleDoubleClick}>
            {keyword}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {hover && !isEditing && (
          <>
            <button onClick={() => setIsEditing(true)}>
              <img src={editIcon} alt="수정하기" className="h-4 w-4" />
            </button>
            {node.depth < 3 ? (
              <button onClick={handleAddButton}>
                <img src={plusIcon} alt="추가하기" className="h-4 w-4" />
              </button>
            ) : (
              <></>
            )}
            <button onClick={handleDeleteButton}>
              <img src={deleteIcon} alt="삭제하기" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

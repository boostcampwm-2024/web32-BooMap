import { Input } from "@headlessui/react";
import { useNodeListContext } from "@/store/NodeListProvider";
import { addNode } from "@/konva_mindmap/events/addNode";
import { useEffect, useRef } from "react";
import { Node } from "@/types/Node";
import { NODE_DEPTH_LIMIT } from "@/constants/node";
import { TbPointFilled } from "react-icons/tb";
import { FaChevronDown } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import useNodeActions from "@/hooks/useNodeActions";
import { findParentNodeKey, getParentNodeKeys } from "@/konva_mindmap/utils/findParentNodeKey";

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
    handleDelete,
  } = useNodeActions(node.id, node.keyword);
  const { data, selectedNode, overrideNodeData, selectNode } = useNodeListContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const parentNodes = getParentNodeKeys(selectedNode.nodeId, data);
  const isSelected = parentNodes.includes(node.id);

  useEffect(() => {
    node.newNode ? setIsEditing(true) : setIsEditing(false);
  }, [node.id, setIsEditing]);

  useEffect(() => {
    if (isSelected) openAccordion();
  }, [isSelected]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleAddButton() {
    selectNode({ nodeId: node.id, parentNodeId: parentNodeId });
    addNode(data, { nodeId: node.id, parentNodeId: parentNodeId }, overrideNodeData, (newNodeId) => {
      selectNode({ nodeId: newNodeId, parentNodeId: node.id });
    });
    openAccordion();
  }

  const selectedBorder = selectedNode.nodeId === node.id ? "border-2 border-blue-500" : "border-2 border-grayscale-600";

  return (
    <div
      className={`flex justify-between rounded-xl bg-grayscale-600 p-[10px] ${selectedBorder}`}
      style={{ marginLeft: `${(node.depth - 1) * 20}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {node.depth < NODE_DEPTH_LIMIT ? (
          <button
            className={`flex h-5 w-5 items-center justify-center p-1 transition-all ${open ? "" : "rotate-[-90deg]"}`}
            onClick={handleAccordion}
          >
            <FaChevronDown className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex h-5 w-5 items-center justify-center">
            <TbPointFilled />
          </div>
        )}

        {isEditing ? (
          <Input
            autoFocus={true}
            ref={inputRef}
            className="flex-grow bg-transparent text-grayscale-200"
            value={keyword}
            onChange={handleChangeKeyword}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            maxLength={30}
          />
        ) : (
          <span className="flex-grow truncate" onDoubleClick={handleDoubleClick}>
            {keyword}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hover && !isEditing && (
          <>
            <button onClick={() => setIsEditing(true)}>
              <FaPencilAlt className="h-4 w-4" />
            </button>
            {node.depth < NODE_DEPTH_LIMIT ? (
              <button onClick={handleAddButton}>
                <FaPlus className="h-4 w-4" />
              </button>
            ) : (
              <></>
            )}
            <button onClick={handleDelete}>
              <FaRegTrashAlt className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

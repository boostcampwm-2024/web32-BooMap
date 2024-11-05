import arrowDown from "@/assets/arrowDown.png";
import plusIcon from "@/assets/plus.png";
import editIcon from "@/assets/pencil.png";
import deleteIcon from "@/assets/trash2.png";
import { Input } from "@headlessui/react";
import useNodeActions from "@/hooks/useNodeActions";
import bulletPointIcon from "@/assets/bulletPoint.png";

type NodeItemProps = {
  content: string;
  depth: number;
  open: boolean;
  handleAccordian: () => void;
};

export default function NodeItem({ content, depth, open, handleAccordian }: NodeItemProps) {
  const {
    hover,
    isEditing,
    keyword,
    handleChangeKeyword,
    handleDoubleClick,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
  } = useNodeActions(content);
  const margin = ((depth - 1) * 5).toString();

  return (
    <div
      className={`flex cursor-pointer justify-between rounded-xl bg-grayscale-600 p-3 ml-${margin}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {depth < 3 ? (
          <img
            src={arrowDown}
            alt="열기"
            className={`h-3 w-4 transition-all ${open ? "" : "rotate-[-90deg]"}`}
            onClick={handleAccordian}
          />
        ) : (
          <img src={bulletPointIcon} alt="구분점" className="h-2 w-2" />
        )}
        {isEditing ? (
          <Input
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
            <img src={editIcon} alt="수정하기" className="h-4 w-4" />
            <img src={plusIcon} alt="추가하기" className="h-4 w-4" />
            <img src={deleteIcon} alt="삭제하기" className="h-4 w-4" />
          </>
        )}
      </div>
    </div>
  );
}

import arrowDown from "@/assets/arrowDown.png";
import plusIcon from "@/assets/plus.png";
import editIcon from "@/assets/pencil.png";
import deleteIcon from "@/assets/trash2.png";
import { Input } from "@headlessui/react";
import useNodeActions from "@/hooks/useNodeActions";

type NodeItemProps = {
  content: string;
};
export default function NodeItem({ content }: NodeItemProps) {
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

  return (
    <div
      className="flex w-full cursor-pointer justify-between rounded-xl bg-grayscale-600 p-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-3">
        <img src={arrowDown} alt="열기" className="h-3 w-4" />
        {isEditing ? (
          <Input
            className="w-36 bg-transparent text-grayscale-200"
            value={keyword}
            onChange={handleChangeKeyword}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            maxLength={30}
          />
        ) : (
          <span className="w-36 truncate" onDoubleClick={handleDoubleClick}>
            {keyword}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {hover && (
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

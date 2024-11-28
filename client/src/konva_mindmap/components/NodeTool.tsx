import { Location } from "@/konva_mindmap/types/location";
import { Button } from "@headlessui/react";
import { FaAddressBook, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { TbCirclePlus2 } from "react-icons/tb";
import { Html } from "react-konva-utils";

type NodeToolProps = {
  offset: Location;
  visible: boolean;
  handleEdit: () => void;
  handleAdd: () => void;
  handleDelete: () => void;
};
export default function NodeTool({ offset, visible, handleEdit, handleAdd, handleDelete }: NodeToolProps) {
  const visibility = visible ? "" : "hidden";
  return (
    <Html groupProps={{ offset: { x: offset.x, y: offset.y }, visible: visible }}>
      <div
        className={`${visibility} flex w-28 justify-center gap-3 rounded-full border border-grayscale-300 bg-white p-3`}
      >
        <Button className="group" onClick={handleEdit}>
          <FaPencilAlt className="h-5 w-5 cursor-pointer fill-black group-hover:fill-grayscale-400" />
        </Button>
        <Button className="group" onClick={handleAdd}>
          <TbCirclePlus2 className="h-5 w-5 cursor-pointer stroke-black group-hover:stroke-grayscale-400" />
        </Button>
        <Button className="group" onClick={handleDelete}>
          <FaRegTrashAlt className="h-5 w-5 cursor-pointer fill-black group-hover:fill-grayscale-400" />
        </Button>
      </div>
    </Html>
  );
}

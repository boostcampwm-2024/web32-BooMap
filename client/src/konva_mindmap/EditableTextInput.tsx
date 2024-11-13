import { Html } from "react-konva-utils";

interface EditableTextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  offsetX: number;
  offsetY: number;
  width: number;
}

export default function EditableTextInput({
  value,
  onChange,
  onKeyDown,
  onBlur,
  offsetX,
  offsetY,
  width,
}: EditableTextInputProps) {
  return (
    <Html groupProps={{ offset: { x: offsetX, y: offsetY } }}>
      <input
        value={value}
        onChange={onChange}
        className={`w-full resize-none bg-transparent text-center text-sm font-semibold text-black ${value.trim() === "" ? "border border-red-500" : ""}`}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        maxLength={14}
        style={{ width }}
      />
    </Html>
  );
}

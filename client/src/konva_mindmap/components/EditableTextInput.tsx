import { Html } from "react-konva-utils";

interface EditableTextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  offsetX: number;
  offsetY: number;
  width: number;
  focus: boolean;
  scale: number;
}

export default function EditableTextInput({
  value,
  onChange,
  onKeyDown,
  onBlur,
  offsetX,
  offsetY,
  width,
  focus,
  scale,
}: EditableTextInputProps) {
  const fontSize = scale >= 1 ? 16 : 16 / scale;

  return (
    <Html groupProps={{ offset: { x: offsetX, y: offsetY } }}>
      <input
        autoFocus={focus}
        value={value}
        onChange={onChange}
        className={`w-full resize-none bg-transparent text-center text-lg font-semibold text-black ${value.trim() === "" ? "border border-red-500" : ""}`}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        maxLength={50}
        style={{ width, fontSize }}
      />
    </Html>
  );
}

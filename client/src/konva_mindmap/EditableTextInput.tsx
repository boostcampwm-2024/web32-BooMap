import { Html } from "react-konva-utils";

interface EditableTextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export default function EditableTextInput({ value, onChange, onKeyDown, onBlur }: EditableTextInputProps) {
  return (
    <Html>
      <input
        value={value}
        onChange={onChange}
        className={`w-full resize-none bg-transparent text-sm font-semibold text-black ${value.trim() === "" ? "border border-red-500" : ""}`}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        maxLength={14}
      />
    </Html>
  );
}

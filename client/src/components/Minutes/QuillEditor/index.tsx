import { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import "./snow.css";

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
  "size",
  "h1",
];

export default function QuillEditor() {
  const [value, setValue] = useState();

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

  function handleQuillChange(value, delta, source, editor) {
    setValue(value);
  }

  return (
    <ReactQuill
      className="flex h-[calc(100%-85.84px)] flex-col bg-white text-black"
      theme="snow"
      modules={modules}
      value={value || ""}
      onChange={handleQuillChange}
      //TODO 특정 사용자인지 판단해 넣기만 하면 됨 ( True일시 읽기 전용 )
      readOnly={false}
    />
  );
}

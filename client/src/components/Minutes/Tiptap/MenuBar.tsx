import { BubbleMenu } from "@tiptap/react";
import { RiH1, RiH2, RiH3 } from "react-icons/ri";
import { BsTypeBold, BsTypeStrikethrough, BsTextLeft, BsTextCenter, BsTextRight, BsJustify } from "react-icons/bs";
import { PiHighlighter } from "react-icons/pi";

export default function MenuBar({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <>
      {editor && (
        <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
          >
            <RiH1 className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
          >
            <RiH2 className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
          >
            <RiH3 className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <BsTypeBold className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <BsTypeStrikethrough className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive("highlight") ? "is-active" : ""}
          >
            <PiHighlighter className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
          >
            <BsTextLeft className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
          >
            <BsTextCenter className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
          >
            <BsTextRight className="buttons" size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
          >
            <BsJustify className="buttons" size={20} />
          </button>
        </BubbleMenu>
      )}
    </>
  );
}

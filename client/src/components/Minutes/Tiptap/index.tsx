import "./styles.css";
import "highlight.js/styles/stackoverflow-dark.min.css";
import { useEditor, EditorContent } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { Indent } from "./utils/indent";
import CustomCodeBlockLowlight from "./utils/codeBlockIndent";
import Placeholder from "@tiptap/extension-placeholder";

export default function Tiptap({ text, setText }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "회의록을 입력해주세요...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Typography,
      Indent,
      CustomCodeBlockLowlight,
    ],
    content: text,
    onUpdate({ editor }) {
      setText(editor.getHTML());
    },
  });

  return (
    <>
      <div
        className="h-full cursor-text overflow-hidden rounded-[20px] border border-solid border-grayscale-500 p-3"
        onClick={() => {
          if (editor) {
            const endPoint = editor.state.selection.to;
            editor.chain().focus().setTextSelection(endPoint).run();
          }
        }}
      >
        <MenuBar editor={editor} />
        <EditorContent editor={editor} onClick={(e) => e.stopPropagation()} />
      </div>
    </>
  );
}

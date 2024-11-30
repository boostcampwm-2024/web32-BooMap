import "./styles.css";
import "highlight.js/styles/stackoverflow-dark.min.css";
import { useEditor, EditorContent } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { getIndent, getOutdent, Indent } from "./utils/indent";
import CustomCodeBlockLowlight from "./utils/codeBlockIndent";
import Placeholder from "@tiptap/extension-placeholder";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useSocketStore } from "@/store/useSocketStore";
import { throttle } from "@/konva_mindmap/utils/throttle";
import { useEffect } from "react";

export default function Tiptap() {
  const { content, updateContent } = useNodeListContext();
  const handleSocketEvent = useSocketStore((state) => state.handleSocketEvent);
  const role = useSocketStore((state) => state.role);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Indent,
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "회의록을 입력해주세요...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Typography,
      CustomCodeBlockLowlight,
    ],
    content: content,
    onUpdate({ editor }) {
      if (!role || role === "editor") return;
      handleChangeContent(editor);
    },
    editable: role === "owner",
  });

  function handleChangeContent(editor) {
    throttle(
      () =>
        handleSocketEvent({
          actionType: "updateContent",
          payload: { content: editor.getHTML() },
          callback: () => {
            updateContent(editor.getHTML());
          },
        }),
      1500,
    );
  }

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <>
      <div
        className="no-scrollbar h-full cursor-text overflow-auto rounded-[20px] border border-solid border-grayscale-500 p-3"
        onClick={() => {
          if (editor) {
            const endPoint = editor.state.selection.to;
            editor.chain().focus().setTextSelection(endPoint).run();
          }
        }}
      >
        <MenuBar editor={editor} />
        <EditorContent
          editor={editor}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Tab") {
              e.preventDefault();
              if (e.shiftKey) {
                getOutdent(false)({ editor });
              } else {
                getIndent()({ editor });
              }
            }
          }}
        />
      </div>
    </>
  );
}

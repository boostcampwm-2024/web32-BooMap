import { BubbleMenu, isActive, Editor } from "@tiptap/react";
import {
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeBold,
  BsTypeStrikethrough,
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
  BsJustify,
} from "react-icons/bs";
import { PiHighlighter } from "react-icons/pi";
import { IconType } from "react-icons";

type MenuBarProps = {
  editor: Editor | null;
};

type MenuButtonProps = {
  action: () => void;
  isActive: () => boolean;
  Icon: IconType;
};

export default function MenuBar({ editor }: MenuBarProps) {
  if (!editor) {
    return null;
  }

  const menuButtons = [
    {
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
      Icon: BsTypeH1,
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      Icon: BsTypeH2,
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
      Icon: BsTypeH3,
    },
    {
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      Icon: BsTypeBold,
    },
    {
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      Icon: BsTypeStrikethrough,
    },
    {
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
      Icon: PiHighlighter,
    },
    {
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
      Icon: BsTextLeft,
    },
    {
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
      Icon: BsTextCenter,
    },
    {
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
      Icon: BsTextRight,
    },
    {
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => editor.isActive({ textAlign: "justify" }),
      Icon: BsJustify,
    },
  ];

  function MenuButton({ action, isActive, Icon }: MenuButtonProps) {
    return (
      <button onClick={action} className={isActive() ? "is-active" : ""}>
        <Icon className="buttons" />
      </button>
    );
  }

  return (
    <>
      {editor && (
        <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
          {menuButtons.map((button, index) => (
            <MenuButton key={index} action={button.action} isActive={button.isActive} Icon={button.Icon} />
          ))}
        </BubbleMenu>
      )}
    </>
  );
}

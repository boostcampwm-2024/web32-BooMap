import { Button } from "@headlessui/react";
import { ReactElement } from "react";

type ButtonProps = {
  text: string;
  onclick: () => void;
  active: boolean;
  children: JSX.Element;
};

export default function OverviewButton({ text, onclick, active, children }: ButtonProps) {
  return (
    <Button
      className={`ml-1 flex items-center gap-6 rounded-lg p-3 hover:text-grayscale-100 hover:brightness-0 hover:invert ${active ? "text-white brightness-0 invert" : ""}`}
      onClick={onclick}
    >
      {children}
      {text}
    </Button>
  );
}

import { Button } from "@headlessui/react";

type ButtonProps = {
  src: string;
  alt: string;
  text: string;
  onclick: () => void;
  active: boolean;
};

export default function OverviewButton({ src, alt, text, onclick, active }: ButtonProps) {
  return (
    <Button
      className={`flex items-center gap-6 rounded-lg p-3 hover:text-grayscale-100 hover:brightness-0 hover:invert ${active ? "text-white brightness-0 invert" : ""}`}
      onClick={onclick}
    >
      <img src={src} alt={alt} className="w-6" />
      {text}
    </Button>
  );
}

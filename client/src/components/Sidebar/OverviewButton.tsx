import { Button } from "@headlessui/react";

type ButtonProps = {
  src: string;
  alt: string;
  text: string;
  onclick: () => void;
};

export default function OverviewButton({ src, alt, text, onclick }: ButtonProps) {
  return (
    <Button className="flex items-center gap-6" onClick={onclick}>
      <img src={src} alt={alt} className="w-6" />
      {text}
    </Button>
  );
}

import { ReactNode } from "react";

export default function ArrowBox({
  children,
  containerClassName,
  boxClassName,
  arrowClassName,
}: {
  children: ReactNode;
  containerClassName: string;
  boxClassName: string;
  arrowClassName: string;
}) {
  return (
    <div className={`absolute ${containerClassName} -left-0.5 -top-10 w-full text-sm`}>
      <div className={`relative rounded-md ${boxClassName} bg-grayscale-500 p-1`}>
        {children}
        <div className={`absolute ${arrowClassName} transform`}></div>
      </div>
    </div>
  );
}

import ArrowBox from "@/components/common/ArrowBox";

export default function UploadAvailabilityArrowBox({ content }: { content: string }) {
  return (
    <>
      {content && (
        <ArrowBox
          containerClassName="-left-0.5 -top-10 w-full text-sm"
          boxClassName="bg-grayscale-500 p-1"
          arrowClassName="bottom-0 left-1/2 z-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 bg-grayscale-500"
        >
          <p>{content}</p>
        </ArrowBox>
      )}
    </>
  );
}

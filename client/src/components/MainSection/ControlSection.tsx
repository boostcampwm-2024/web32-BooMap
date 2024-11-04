import TextUpload from "@/components/MainSection/TextUpload";
import VoiceFileUpload from "@/components/MainSection/VoiceFileUpload";

export default function ControlSection() {
  return (
    <section className="bg-grayscale-700 w-1/3 min-w-80 p-8 rounded-[20px] h-full ">
      <VoiceFileUpload />
    </section>
  );
}

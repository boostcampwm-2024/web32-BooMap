import ListView from "@/components/MainSection/ControlSection/ListView";
import TextUpload from "@/components/MainSection/ControlSection/TextUpload";
import VoiceFileUpload from "@/components/MainSection/ControlSection/VoiceFileUpload";
import useSection from "@/hooks/useSection";

export default function ControlSection() {
  const mode = useSection().getmode() as keyof typeof modeView;
  const modeView = {
    voiceupload: <VoiceFileUpload />,
    listview: <ListView />,
    textupload: <TextUpload />,
    default: <TextUpload />,
  };

  return (
    <section className="h-full w-1/3 min-w-80 max-w-[420px] rounded-[20px] bg-grayscale-700 p-8">
      {modeView[mode] || modeView.default}
    </section>
  );
}

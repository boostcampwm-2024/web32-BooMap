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
    <section className="relative w-full min-w-80 max-w-[420px] flex-grow rounded-[20px] bg-grayscale-700">
      <div className="no-scrollbar absolute left-0 top-0 mb-8 box-border h-full w-full overflow-y-scroll p-8">
        {modeView[mode] || modeView.default}
      </div>
    </section>
  );
}

import ControlSection from "@/components/MainSection/ControlSection";

export default function MainSection() {
  return (
    <main className="box-border flex h-full flex-col p-8">
      <p className="p-3 text-2xl">음성파일 변환하기</p>
      <div className="h-full">
        <ControlSection />
      </div>
    </main>
  );
}

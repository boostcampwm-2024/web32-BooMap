import MindMapMainSection from "@/components/MindMapMainSection";
import NodeListProvider from "@/store/NodeListProvider";

export default function MindMap() {
  return (
    <div className="flex h-full w-full flex-col">
      <NodeListProvider>
        <MindMapMainSection />
      </NodeListProvider>
    </div>
  );
}

import Spinner from "@/components/common/Spinner";
import useAuth from "@/hooks/useAuth";
import NodeListProvider from "@/store/NodeListProvider";
import { lazy, Suspense } from "react";

const MindMapMainSection = lazy(() => import("@/components/MindMapMainSection"));

export default function MindMap() {
  const { isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  return (
    <>
      <div className="flex h-full w-full flex-col">
        <NodeListProvider>
          <Suspense fallback={<Spinner />}>
            <MindMapMainSection />
          </Suspense>
        </NodeListProvider>
      </div>
    </>
  );
}

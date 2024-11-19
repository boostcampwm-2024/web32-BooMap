import Authorize from "@/components/Authorize";
import NotFound from "@/components/common/NotFound";
import Spinner from "@/components/common/Spinner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function AuthorizeCallback() {
  return (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Spinner />}>
        <Authorize />
      </Suspense>
    </ErrorBoundary>
  );
}

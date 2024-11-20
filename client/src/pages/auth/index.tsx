import Authorize from "@/components/Authorize";
import NotFound from "@/components/common/NotFound";
import { ErrorBoundary } from "react-error-boundary";

export default function AuthorizeCallback() {
  return (
    <ErrorBoundary fallback={<NotFound />}>
      <Authorize />
    </ErrorBoundary>
  );
}

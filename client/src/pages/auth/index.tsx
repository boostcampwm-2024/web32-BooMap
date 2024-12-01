import Authorize from "@/components/Authorize";
import Error from "@/components/common/Error";
import { ErrorBoundary } from "react-error-boundary";

export default function AuthorizeCallback() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Authorize />
    </ErrorBoundary>
  );
}

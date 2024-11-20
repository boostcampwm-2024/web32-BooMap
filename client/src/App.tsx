import MainPage from "@/pages/Main";
import "./App.css";
import { Suspense } from "react";
import Spinner from "@/components/common/Spinner";
import { ErrorBoundary } from "react-error-boundary";
import NotFound from "@/components/common/NotFound";

export default function App() {
  return (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Spinner />}>
        <MainPage />;
      </Suspense>
    </ErrorBoundary>
  );
}

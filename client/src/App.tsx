import MainPage from "@/pages/Main";
import "./App.css";
import { Suspense } from "react";
import Spinner from "@/components/common/Spinner";

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <MainPage />
    </Suspense>
  );
}

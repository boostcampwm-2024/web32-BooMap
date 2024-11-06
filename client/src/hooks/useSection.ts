import { useSearchParams } from "react-router-dom";

export type SectionViewMode = "textupload" | "voiceupload" | "dashboard" | "listview";
export default function useSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleViewMode(mode: SectionViewMode) {
    if (getmode() === mode) return;
    searchParams.set("mode", mode);
    setSearchParams(searchParams);
  }

  function getmode() {
    return searchParams.get("mode") ?? "textupload";
  }

  return {
    searchParams,
    getmode,
    handleViewMode,
  };
}

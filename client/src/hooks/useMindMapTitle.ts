import { useState } from "react";

export default function useMindMapTitle() {
  const [title, setTitle] = useState("제목없는 마인드맵");

  function updateTitle(newTitle: string) {
    setTitle(newTitle);
  }

  function initializeTitle(initializeData) {
    if (initializeData.title) setTitle(initializeData.title);
  }

  return { title, updateTitle, initializeTitle };
}

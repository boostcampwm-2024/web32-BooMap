import { useState } from "react";

export default function useContent() {
  const [content, setContent] = useState("");
  function updateContent(updatedContent: string) {
    setContent(updatedContent);
  }
  function initializeContent(initialData) {
    if (initialData.content) updateContent(initialData.content);
  }

  return { content, updateContent, initializeContent };
}

import { MIN_TEXT_UPLOAD_LIMIT } from "@/constants/textUploadLimit";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useEffect, useState } from "react";

export default function useUpload() {
  const [content, setContent] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);
  const role = useConnectionStore((state) => state.currentRole);
  const socket = useConnectionStore((state) => state.socket);
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const [availabilityInformBox, setAvailabilityInformBox] = useState(false);

  const buttonAvailability = role === "owner";

  useEffect(() => {
    socket?.on("aiPending", (response) => {
      setAiProcessing(response.status);
    });
  }, [socket]);

  function handleAiProcessButton() {
    if (content.length <= MIN_TEXT_UPLOAD_LIMIT || !buttonAvailability) return;
    handleSocketEvent({ actionType: "aiRequest", payload: { aiContent: content } });
  }

  function updateContent(content: string) {
    setContent(content);
  }

  function handleMouseEnter() {
    if (!buttonAvailability) setAvailabilityInformBox(true);
  }
  function handleMouseLeave() {
    setAvailabilityInformBox(false);
  }

  return {
    content,
    updateContent,
    aiProcessing,
    buttonAvailability,
    handleAiProcessButton,
    availabilityInformBox,
    handleMouseEnter,
    handleMouseLeave,
  };
}

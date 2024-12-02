import { MIN_TEXT_UPLOAD_LIMIT } from "@/constants/textUploadLimit";
import { useNodeListContext } from "@/store/NodeListProvider";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useState } from "react";

export default function useUpload() {
  const [content, setContent] = useState("");
  const role = useConnectionStore((state) => state.currentRole);
  const handleSocketEvent = useConnectionStore((state) => state.handleSocketEvent);
  const { aiCount } = useNodeListContext();
  const [availabilityInform, setAvailabilityInform] = useState("");

  const ownerAvailability = role === "owner";

  function handleAiProcessButton() {
    if (content.length <= MIN_TEXT_UPLOAD_LIMIT || !ownerAvailability) return;
    handleSocketEvent({ actionType: "aiRequest", payload: { aiContent: content } });
  }

  function updateContent(content: string) {
    setContent(content);
  }

  function handleMouseEnter() {
    checkAvailability();
  }

  function handleMouseLeave() {
    setAvailabilityInform("");
  }

  function checkAvailability() {
    if (!ownerAvailability) {
      setAvailabilityInform("마인드맵 소유자만 AI 변환을 할 수 있어요");
      return;
    }
    if (!aiCount) {
      setAvailabilityInform("모든 AI 변환 요청을 다 사용했어요");
      return;
    }
  }

  return {
    content,
    updateContent,
    handleAiProcessButton,
    handleMouseEnter,
    handleMouseLeave,
    availabilityInform,
  };
}

import { useNodeListContext } from "@/store/NodeListProvider";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useState } from "react";

export default function useUpload() {
  const [content, setContent] = useState("");
  const role = useConnectionStore((state) => state.currentRole);
  const { aiCount } = useNodeListContext();
  const [availabilityInform, setAvailabilityInform] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const ownerAvailability = role === "owner";

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

  function updateErrorMsg(message: string) {
    setErrorMsg(message);
  }

  return {
    content,
    updateContent,
    handleMouseEnter,
    handleMouseLeave,
    availabilityInform,
    errorMsg,
    updateErrorMsg,
  };
}

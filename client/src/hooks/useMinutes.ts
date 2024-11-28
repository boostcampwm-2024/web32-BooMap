import { useState } from "react";

export default function useMinutes() {
  const [showMinutes, setShowMinutes] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  function handleShowMinutes() {
    setShowMinutes(!showMinutes);
    setIsAnimating(true);
  }

  function handleIsAnimating() {
    setIsAnimating(false);
  }

  return { showMinutes, handleShowMinutes, isAnimating, handleIsAnimating };
}

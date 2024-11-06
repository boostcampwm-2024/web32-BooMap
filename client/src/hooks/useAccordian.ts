import { useState } from "react";

export default function useAccordian() {
  const [open, setOpen] = useState(false);
  function handleAccordian() {
    setOpen(!open);
  }
  return { open, handleAccordian };
}

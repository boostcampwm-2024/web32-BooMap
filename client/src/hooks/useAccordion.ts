import { useState } from "react";

export default function useAccordion() {
  const [open, setOpen] = useState(false);
  function handleAccordion() {
    setOpen(!open);
  }
  function openAccordion() {
    if (!open) setOpen(!open);
  }
  return { open, handleAccordion, openAccordion };
}

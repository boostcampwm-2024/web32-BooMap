import { Button, Input } from "@headlessui/react";
import Modal from "../common/Modal";
import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

interface ShareModalProps {
  open: boolean;
  closeModal: () => void;
}

export default function ShareModal({ open, closeModal }: ShareModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const currentUrl = window.location.href;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
    } catch (error) {
      console.error("링크 복사 실패!!!");
    }
    setTimeout(() => setCopySuccess(false), 2000);
  }

  return (
    <Modal open={open} closeModal={closeModal}>
      <div className="py-4">
        <p className="mb-3 text-lg font-bold text-black">협업 링크</p>
        <Input
          type="text"
          value={currentUrl}
          readOnly
          className="pointer-events-none h-10 w-full truncate rounded-lg bg-grayscale-200 px-3 py-2 text-grayscale-500"
        />
        <Button
          onClick={copyLink}
          className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-bm-blue transition hover:brightness-90"
        >
          {copySuccess === true ? <FiCheck size={18} /> : <FiCopy size={18} />}
          <p className="text-sm">{copySuccess === true ? "복사 완료" : "링크 복사"}</p>
        </Button>
        <p className="mt-3 border-t pt-1 text-[10px] text-grayscale-400">
          복사된 링크를 통해 팀원들과 브레인스토밍을 해보세요
        </p>
      </div>
    </Modal>
  );
}

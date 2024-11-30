import { Button, Input } from "@headlessui/react";
import { useState } from "react";

export default function TestPage() {
  const [inputValue, setInputValue] = useState(""); // 입력값 상태 관리
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // 입력값 업데이트
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    try {
      const response = await fetch("https://localhost:5000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: inputValue }), // API에 JSON 데이터로 전송
      });

      const result = await response.json();
      setResponseMessage(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <p>
      <form onSubmit={handleSubmit}>
        <Input value={inputValue} onChange={handleInputChange} className="border border-2" />
        <Button type="submit">Send</Button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </p>
  );
}

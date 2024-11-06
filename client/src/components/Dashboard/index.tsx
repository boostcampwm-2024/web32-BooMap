import { test } from "@/api/test";
import { Button } from "@headlessui/react";

export default function DashBoard() {
  async function testingApi() {
    try {
      const response = await test();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Button onClick={testingApi}>API 뾰용용</Button>
    </div>
  );
}

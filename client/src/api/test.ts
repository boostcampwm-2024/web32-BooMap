import { instance } from "@/api";

export async function test() {
  return instance.get("/test");
}

import { instance } from "@/api";

export async function createMindmap() {
  return instance.post("/connection");
}

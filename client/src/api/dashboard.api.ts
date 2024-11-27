import { instance } from "@/api";
import { DashBoard } from "@/konva_mindmap/types/dashboard";

export async function getDashBoard(): Promise<DashBoard[]> {
  const { data } = await instance.get("/dashboard");
  return data;
}

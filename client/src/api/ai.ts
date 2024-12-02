import { instance } from "@/api";

export function AudioAiConvert(formData: FormData, mindmapId: string) {
  return instance.post(
    `ai/audio/${mindmapId}`,
    {
      formData,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

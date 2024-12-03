export function audioFormData(file: File, mindmapId: string, connectionId: string) {
  const formData = new FormData();
  formData.append("aiAudio", file);
  formData.append("mindmapId", mindmapId);
  formData.append("connectionId", connectionId);
  return formData;
}

export function audioFormData(file: File, mindmapId: string, connectionId: string) {
  const formData = new FormData();

  const encodedFileName = encodeURIComponent(file.name);
  const encodedFile = new File([file], encodedFileName, { type: file.type });

  formData.append("aiAudio", encodedFile);
  formData.append("mindmapId", mindmapId);
  formData.append("connectionId", connectionId);

  return formData;
}

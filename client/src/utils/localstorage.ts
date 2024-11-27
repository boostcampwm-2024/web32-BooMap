export const getToken = () => localStorage.getItem("Bearer");
export const removeToken = () => localStorage.removeItem("Bearer");
export const setToken = (token: string) => localStorage.setItem("Bearer", token);

export const setOwner = (mindMapId: string) => {
  let mindmaps: string[] = JSON.parse(localStorage.getItem("owner") || "[]");
  mindmaps.push(mindMapId);
  localStorage.setItem("owner", JSON.stringify(mindmaps));
};

export const checkOwner = (mindMapId: string) => {
  const mindmaps: string[] = JSON.parse(localStorage.getItem("owner"));
  if (!mindmaps) return false;
  return mindmaps.some((history) => history === mindMapId);
};

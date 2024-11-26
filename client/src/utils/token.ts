export const getToken = () => localStorage.getItem("Bearer");
export const removeToken = () => localStorage.removeItem("Bearer");
export const setToken = (token: string) => localStorage.setItem("Bearer", token);

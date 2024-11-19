import axios from "axios";

export const instance = axios.create({
  baseURL: "https://boomap.site/api",
  timeout: 1000,
  withCredentials: true,
});

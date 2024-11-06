import axios from "axios";

export const instance = axios.create({
  baseURL: "http://www.boomap.site/api",
  timeout: 1000,
});

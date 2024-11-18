import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:80/api", // TODO: change to production URL
  timeout: 1000,
});

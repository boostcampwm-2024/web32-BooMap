import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: false,
    host: true,
    port: 5173,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: "/src",
      },
    ],
  },
  build: {
    outDir: "dist",
  },
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
  },
});

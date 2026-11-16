import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), react()],
  server: { proxy: { "/api": "http://127.0.0.1:8080" } },
  // `npm run build` writes straight into Spring Boot's static folder
  build: { outDir: "../backend/src/main/resources/static", emptyOutDir: true },
});

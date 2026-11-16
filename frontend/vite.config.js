import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:8081" } },
  // `npm run build` writes straight into Spring Boot's static folder
  build: { outDir: "../backend/src/main/resources/static", emptyOutDir: true },
});

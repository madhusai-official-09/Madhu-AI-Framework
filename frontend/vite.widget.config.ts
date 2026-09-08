import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist/widget",
    emptyOutDir: false,
    lib: {
      entry: "src/widget/mount.tsx",
      name: "MadhuAIWidget",
      fileName: "madhu-ai-widget",
      formats: ["es", "umd"],
    },
    cssCodeSplit: false,
  },
});
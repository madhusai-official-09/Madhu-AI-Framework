import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: "wss",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          markdown: ["react-markdown", "remark-gfm"],
          syntax: ["react-syntax-highlighter"],
          motion: ["framer-motion"],
          icons: ["lucide-react", "react-icons"],
          ogl: ["ogl"],
        },
      },
    },
  },
});



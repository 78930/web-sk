import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite dev server proxies /api to the existing Express backend so the
// browser talks to the same origin in development (no CORS surprises).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

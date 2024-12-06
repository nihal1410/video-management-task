import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL
            ? env.VITE_BACKEND_URL + "/api"
            : "http://localhost:8080/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});

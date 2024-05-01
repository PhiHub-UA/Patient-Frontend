import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'


export default defineConfig({
  plugins: [react(), TanStackRouterVite(),],
  server: {
    host:'0.0.0.0',
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

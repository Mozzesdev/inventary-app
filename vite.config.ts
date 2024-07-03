import react from "@vitejs/plugin-react";
import ssr from "vike/plugin";
import { defineConfig } from "vite";
import vercel from "vite-plugin-vercel";

export default defineConfig({
  plugins: [react(), ssr(), vercel()],
});

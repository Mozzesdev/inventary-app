import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import vercel from "vite-plugin-vercel";
import { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [react(), vike(), vercel()],
};

export default config;

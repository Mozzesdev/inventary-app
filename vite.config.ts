import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { UserConfig } from "vite";
import vercel from "vite-plugin-vercel";

export default {
  plugins: [vike(), react(), vercel({
    source: "/.*",
  })],
  vercel: {
    additionalEndpoints: [
      {
        source: "index.ts",
        destination: "ssr_",
        addRoute: false,
      },
    ],
  },
} satisfies UserConfig;
import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./server/config.js";
import redis from "./server/redis/config.js";
import { corsMiddleware } from "./server/middlewares/cors.middleware.js";
import { userMiddleware } from "./server/middlewares/user.middleware.js";
import renderMiddleware from "./server/middlewares/render.middleware.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import apiRouter from "./server/api/router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;

export default (await startServer()) as unknown;

async function startServer() {
  const app = express();

  app.disable("x-powered-by");
  app.use(corsMiddleware());
  app.use(cookieParser());

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${root}/dist/client`));
  } else {
    const vite = await import("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  app.use("/api", apiRouter);
  app.all("*", userMiddleware, renderMiddleware);

  process.on("SIGINT", async () => {
    await redis.quit();
    process.exit();
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
  return app;
}

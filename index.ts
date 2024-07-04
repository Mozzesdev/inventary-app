import express from "express";
import compression from "compression";
import apiRouter from "./server/api/router.js";
import cookieParser from "cookie-parser";
import { NODE_ENV, PORT } from "./server/config.js";
import redis from "./server/redis/config.js";
import { corsMiddleware } from "./server/middlewares/cors.middleware.js";
import { userMiddleware } from "./server/middlewares/user.middleware.js";
import renderMiddleware from "./server/middlewares/render.middleware.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;

const app = express();
app.disable("x-powered-by");
app.use(corsMiddleware());

app.use(compression());

const isProduction = NODE_ENV === "production";

if (isProduction) {
  const sirv = (await import("sirv")).default;
  app.use(sirv(`${root}/dist/client`));
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRouter);
app.all("*", userMiddleware, renderMiddleware);

process.on("SIGINT", async () => {
  await redis.quit();
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
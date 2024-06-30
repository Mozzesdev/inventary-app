import express from "express";
import compression from "compression";
import { root } from "./root.js";
import apiRouter from "./api/router.js";
import cookieParser from "cookie-parser";
import { NODE_ENV, PORT } from "./config.js";
import redis from "./redis/config.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { userMiddleware } from "./middlewares/user.middleware.js";
import renderMiddleware from "./middlewares/render.middleware.js";

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
app.get("*", userMiddleware, renderMiddleware);

process.on("SIGINT", async () => {
  await redis.quit();
  console.log("Desconectado de Redis al cerrar la aplicación.");
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


export default app;

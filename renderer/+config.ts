import type { Config } from "vike/types";
import { ssrEffect } from "./ssrEffect.js";
import config from '@vite-plugin-vercel/vike/config';

import "../types/index.js";
import { isNotFalse } from "../utils/isNotFalse.js";
import { onRenderHtml } from "./onRenderHtml.js";
import { onRenderClient } from "./onRenderClient.js";
import { onBeforeRender } from "./onBeforeRender.js";

export default {
  extends: config,
  prerender: false,
  name: "vike-plugin",
  require: {
    vike: ">=0.4.173",
  },
  onRenderHtml: onRenderHtml,
  onRenderClient: onRenderClient,
  onBeforeRender: onBeforeRender,
  passToClient: [
    process.env.NODE_ENV !== "production" && "$$typeof",
  ].filter(isNotFalse),
  clientRouting: true,
  hydrationCanBeAborted: true,
  title: "Test Vike Streaming",
  stream: true,
  meta: {
    Head: {
      env: { server: true },
    },
    Layout: {
      env: { server: true, client: true },
      cumulative: true,
    },
    title: {
      env: { server: true, client: true },
    },
    favicon: {
      env: { server: true, client: true },
    },
    lang: {
      env: { server: true, client: true },
    },
    ssr: {
      env: { config: true },
      effect: ssrEffect,
    },
    stream: {
      env: { server: true },
    },
    streamIsRequired: {
      env: { server: true },
    },
    onBeforeRenderClient: {
      env: { client: true },
    },
    onAfterRenderClient: {
      env: { client: true },
    },
    Wrapper: {
      cumulative: true,
      env: { client: true, server: true },
    },
    name: {
      env: { config: true },
    },
    require: {
      env: { config: true },
    },
    reactStrictMode: {
      env: { client: true, server: true },
    },
  },
} satisfies Config;

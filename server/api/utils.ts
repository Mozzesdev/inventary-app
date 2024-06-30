import { createRequire } from "node:module";
import { dirname } from "node:path";
import base32 from "hi-base32";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const require = createRequire(import.meta.url);

export const readJSON = (path: string) => require(path);

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15);
  return base32.encode(buffer).replace(/=/g, "").substring(0, 24);
};

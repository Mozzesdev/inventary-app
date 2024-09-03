import base32 from "hi-base32";
import crypto from "node:crypto";

export const generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15);
  return base32.encode(buffer).replace(/=/g, "").substring(0, 24);
};

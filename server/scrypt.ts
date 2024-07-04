import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt);

/**
 * Generate a hash for the given data.
 * @param data - The data to be hashed.
 * @returns The salt and the hash separated by a colon.
 */
async function hash(data: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(data, salt, 32)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify the given data against a hash.
 * @param data - The data to verify.
 * @param hash - The hash to verify against.
 * @returns True if the data matches the hash, otherwise false.
 */
async function compare(data: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  const derivedKey = (await scrypt(data, salt, 32)) as Buffer;
  return key === derivedKey.toString("hex");
}

export default { hash, compare };

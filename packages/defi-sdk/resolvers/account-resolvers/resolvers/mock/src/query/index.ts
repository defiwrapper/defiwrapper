import { env } from "./w3";

export function requireEnv(): boolean {
  if (!env) return false;
  return true;
}

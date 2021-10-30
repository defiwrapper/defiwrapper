import { Nullable } from "@web3api/wasm-as";

export function boolToString(bool: Nullable<boolean>): string {
  return bool ? "true" : "false";
}

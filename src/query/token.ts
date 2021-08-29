import { BigInt } from "@web3api/wasm-as";

import { ERC20 } from "../utils/ERC20";
import { Ethereum_Connection, Token } from "./w3";

export function getToken(
  address: string,
  connection: Ethereum_Connection
): Token {
  let token: ERC20 = new ERC20(address, connection);
  let isValid: boolean = true;
  if (
    token.decimals == -1 ||
    token.totalSupply == BigInt.fromString("-1") ||
    token.symbol == "Unknown" ||
    token.name == "Unknown"
  ) {
    isValid = false;
  }
  return {
    address: isValid ? address : "Unknown",
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    totalSupply: token.totalSupply,
  };
}

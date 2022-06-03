import { BigInt } from "@web3api/wasm-as";

import { Token } from "../../w3";

export const tokenMap = new Map<string, Token>()
  .set("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    totalSupply: BigInt.fromString("1000000000000000000000000"),
  })
  .set("0xdac17f958d2ee523a2206206994597c13d831ec7", {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    totalSupply: BigInt.fromString("1000000000000000000000000"),
  })
  .set("0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", {
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    name: "Matic (POS)",
    symbol: "MATIC",
    decimals: 18,
    totalSupply: BigInt.fromString("1000000000000000000000000"),
  })
  .set("0x6b175474e89094c44da98b954eedeac495271d0f", {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    totalSupply: BigInt.fromString("1000000000000000000000000"),
  })
  .set("0xae7ab96520de3a18e5e111b5eaab095312d7fe84", {
    address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    name: "Lido Staked Ether",
    symbol: "STETH",
    decimals: 18,
    totalSupply: BigInt.fromString("1000000000000000000000000"),
  });

export function getToken(address: string): Token {
  return tokenMap.get(address) as Token;
}

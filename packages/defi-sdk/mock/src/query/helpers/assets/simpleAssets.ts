import { BigInt } from "@web3api/wasm-as";

import { TokenBalance } from "../../w3";

export const simpleAssets: TokenBalance[] = [
  {
    token: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      totalSupply: BigInt.fromString("1000000000000000000000000"),
    },
    balance: "100",
    values: [
      {
        currency: "usd",
        price: "1",
        value: "100",
      },
      {
        currency: "eur",
        price: "1.07",
        value: "93.4",
      },
    ],
  },
  {
    token: {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      totalSupply: BigInt.fromString("1000000000000000000000000"),
    },
    balance: "500",
    values: [
      {
        currency: "usd",
        price: "1",
        value: "500",
      },
      {
        currency: "eur",
        price: "1.07",
        value: "467",
      },
    ],
  },
  {
    token: {
      address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      name: "Matic (POS)",
      symbol: "MATIC",
      decimals: 18,
      totalSupply: BigInt.fromString("1000000000000000000000000"),
    },
    balance: "100",
    values: [
      {
        currency: "usd",
        price: "0.5",
        value: "50",
      },
      {
        currency: "eur",
        price: "0.4",
        value: "40",
      },
    ],
  },
  {
    token: {
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      totalSupply: BigInt.fromString("1000000000000000000000000"),
    },
    balance: "100",
    values: [
      {
        currency: "usd",
        price: "1.01",
        value: "101",
      },
      {
        currency: "eur",
        price: "0.94",
        value: "94",
      },
    ],
  },
  {
    token: {
      address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
      name: "Lido Staked Ether",
      symbol: "STETH",
      decimals: 18,
      totalSupply: BigInt.fromString("1000000000000000000000000"),
    },
    balance: "2",
    values: [
      {
        currency: "usd",
        price: "2000",
        value: "4000",
      },
      {
        currency: "eur",
        price: "1900",
        value: "3800",
      },
    ],
  },
];

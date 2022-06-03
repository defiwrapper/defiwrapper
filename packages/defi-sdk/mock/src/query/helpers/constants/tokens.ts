import { randint } from "../random";

export const tokenList = [
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0x6b175474e89094c44da98b954eedeac495271d0f",
  "0xef68e7c694f40c8202821edf525de3782458639f",
  "0x514910771af9ca656af840dff83e8264ecf986ca",
  "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
];

export function getRandomToken(): string {
  return tokenList[randint() % tokenList.length];
}

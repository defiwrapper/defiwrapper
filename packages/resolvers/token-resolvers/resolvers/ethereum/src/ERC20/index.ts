import { BigInt } from "@polywrap/wasm-as";
import { Box } from "as-container";

import { TokenResolver_Token } from "../wrap";
import { getDecimals } from "./getDecimals";
import { getName } from "./getName";
import { getSymbol } from "./getSymbol";
import { getTotalSupply } from "./getTotalSupply";

class ERC20 {
  address: string;

  constructor(address: string) {
    this.address = address;
  }
  get name(): string | null {
    return getName(this.address);
  }
  get symbol(): string | null {
    return getSymbol(this.address);
  }
  get decimals(): Box<i32> | null {
    return getDecimals(this.address);
  }
  get totalSupply(): Box<BigInt> | null {
    return getTotalSupply(this.address);
  }
}

export function getERC20Token(address: string): TokenResolver_Token {
  const token: ERC20 = new ERC20(address);
  if (
    token.name == null ||
    token.symbol == null ||
    token.decimals == null ||
    token.totalSupply == null
  ) {
    throw new Error(`Token ${address} is not a valid ERC20 token`);
  }
  return {
    address: address.toLowerCase(),
    name: token.name as string,
    symbol: token.symbol as string,
    decimals: (token.decimals as Box<i32>).unwrap() as i32,
    totalSupply: (token.totalSupply as Box<BigInt>).unwrap() as BigInt,
  };
}

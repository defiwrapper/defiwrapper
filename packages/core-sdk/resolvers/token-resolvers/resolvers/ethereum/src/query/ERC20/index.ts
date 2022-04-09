import { BigInt } from "@web3api/wasm-as";
import { Box } from "as-container";

import { Ethereum_Connection, TokenResolver_Token } from "../w3";
import { getDecimals } from "./getDecimals";
import { getName } from "./getName";
import { getSymbol } from "./getSymbol";
import { getTotalSupply } from "./getTotalSupply";

class ERC20 {
  address: string;
  connection: Ethereum_Connection;

  constructor(address: string, connection: Ethereum_Connection) {
    this.address = address;
    this.connection = connection;
  }
  get name(): string | null {
    return getName(this.address, this.connection);
  }
  get symbol(): string | null {
    return getSymbol(this.address, this.connection);
  }
  get decimals(): Box<i32> | null {
    return getDecimals(this.address, this.connection);
  }
  get totalSupply(): Box<BigInt> | null {
    return getTotalSupply(this.address, this.connection);
  }
}

export function getERC20Token(
  address: string,
  connection: Ethereum_Connection,
): TokenResolver_Token {
  const token: ERC20 = new ERC20(address, connection);
  if (
    token.name == null ||
    token.symbol == null ||
    token.decimals == null ||
    token.totalSupply == null
  ) {
    throw new Error(`Token ${address} is not a valid ERC20 token`);
  }
  return {
    address: address,
    name: token.name as string,
    symbol: token.symbol as string,
    decimals: (token.decimals as Box<i32>).unwrap() as i32,
    totalSupply: (token.totalSupply as Box<BigInt>).unwrap() as BigInt,
  };
}

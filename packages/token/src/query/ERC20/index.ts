import { BigInt, Nullable } from "@web3api/wasm-as";

import { Ethereum_Connection, Token } from "../../query/w3";
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
  get name(): Nullable<string> {
    return getName(this.address, this.connection);
  }
  get symbol(): Nullable<string> {
    return getSymbol(this.address, this.connection);
  }
  get decimals(): Nullable<i32> {
    return getDecimals(this.address, this.connection);
  }
  get totalSupply(): Nullable<BigInt> {
    return getTotalSupply(this.address, this.connection);
  }
}

export function getERC20Token(address: string, connection: Ethereum_Connection): Token | null {
  const token: ERC20 = new ERC20(address, connection);
  if (token.decimals.isNull || token.name.isNull || token.symbol.isNull || token.decimals.isNull) {
    return null;
  }
  return {
    address: address,
    name: token.name.value,
    symbol: token.symbol.value,
    decimals: token.decimals.value,
    totalSupply: token.totalSupply.value,
  };
}

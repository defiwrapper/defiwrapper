import { BigInt } from "@web3api/wasm-as";

import { Ethereum_Connection } from "../../query/w3";
import { getDecimals } from "./getDecimals";
import { getName } from "./getName";
import { getSymbol } from "./getSymbol";
import { getTotalSupply } from "./getTotalSupply";

export class ERC20 {
  address: string;
  connection: Ethereum_Connection;

  constructor(address: string, connection: Ethereum_Connection) {
    this.address = address;
    this.connection = connection;
  }
  get name(): string {
    return getName(this.address, this.connection);
  }
  get symbol(): string {
    return getSymbol(this.address, this.connection);
  }
  get decimals(): i32 {
    return getDecimals(this.address, this.connection);
  }
  get totalSupply(): BigInt {
    return getTotalSupply(this.address, this.connection);
  }
}

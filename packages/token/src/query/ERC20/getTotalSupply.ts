import { BigInt } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";

export function getTotalSupply(address: string, connection: Ethereum_Connection): BigInt {
  const totalSupply: string = Ethereum_Query.callContractView({
    address: address,
    method: "function totalSupply() external view returns (uint)",
    args: [],
    connection: connection,
  });
  return totalSupply ? BigInt.fromString(totalSupply) : BigInt.fromString("-1");
}

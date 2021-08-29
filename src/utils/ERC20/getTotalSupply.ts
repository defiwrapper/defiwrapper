import { Ethereum_Query, Ethereum_Connection } from "../../query/w3";

import { BigInt } from "@web3api/wasm-as";

export function getTotalSupply(
  address: string,
  connection: Ethereum_Connection
): BigInt {
  const totalSupply: string = Ethereum_Query.callContractView({
    address: address,
    method: "function totalSupply() external view returns (uint)",
    args: [],
    connection: connection,
  });
  return totalSupply ? BigInt.fromString(totalSupply) : BigInt.fromString("-1");
}

import { BigInt, Nullable } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";

export function getTotalSupply(address: string, connection: Ethereum_Connection): Nullable<BigInt> {
  const totalSupplyResult = Ethereum_Query.callContractView({
    address: address,
    method: "function totalSupply() external view returns (uint)",
    args: [],
    connection: connection,
  });

  if (totalSupplyResult.isOk) {
    return Nullable.fromValue(BigInt.fromString(totalSupplyResult.unwrap()));
  }

  return Nullable.fromNull<BigInt>();
}

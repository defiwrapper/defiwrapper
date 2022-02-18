import { Nullable } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";

export function getDecimals(address: string, connection: Ethereum_Connection): Nullable<i32> {
  const decimalsResult = Ethereum_Query.callContractView({
    address: address,
    method: "function decimals() external pure returns (uint8)",
    args: [],
    connection: connection,
  });

  if (decimalsResult.isOk) {
    const decimals = decimalsResult.unwrap();
    if (decimals) return Nullable.fromValue(I32.parseInt(decimals));
  }

  return Nullable.fromNull<i32>();
}

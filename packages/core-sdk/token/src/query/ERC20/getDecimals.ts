import { BigInt } from "@web3api/wasm-as";
import { Box } from "as-container";

import { Ethereum_Connection, Ethereum_Query } from "../w3";

export function getDecimals(address: string, connection: Ethereum_Connection): Box<i32> | null {
  if (address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Query.getNetwork({ connection }).unwrap();
    return network.chainId == BigInt.ONE ? Box.from(18) : null;
  }
  const decimalsResult = Ethereum_Query.callContractView({
    address: address,
    method: "function decimals() external view returns (uint8)",
    args: [],
    connection: connection,
  });

  if (decimalsResult.isOk) {
    const decimals = decimalsResult.unwrap();
    if (decimals) return Box.from(I32.parseInt(decimals));
  }

  return null;
}

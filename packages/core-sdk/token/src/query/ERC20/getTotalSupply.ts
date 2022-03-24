import { BigInt } from "@web3api/wasm-as";
import { Box } from "as-container";

import { Ethereum_Connection, Ethereum_Query } from "../w3";

export function getTotalSupply(
  address: string,
  connection: Ethereum_Connection,
): Box<BigInt> | null {
  if (address.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Query.getNetwork({ connection }).unwrap();
    return network.chainId == 1 ? Box.from(BigInt.NEG_ONE) : null;
  }
  const totalSupplyResult = Ethereum_Query.callContractView({
    address: address,
    method: "function totalSupply() external view returns (uint)",
    args: [],
    connection: connection,
  });

  if (totalSupplyResult.isOk) {
    return Box.from(BigInt.fromString(totalSupplyResult.unwrap()));
  }

  return null;
}

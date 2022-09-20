import { BigInt } from "@polywrap/wasm-as";
import { Box } from "as-container";

import { Ethereum_Module } from "../wrap";

export function getTotalSupply(address: string): Box<BigInt> | null {
  if (address.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Module.getNetwork({ connection: null }).unwrap();
    return network.chainId == BigInt.ONE ? Box.from(BigInt.NEG_ONE) : null;
  }
  const totalSupplyResult = Ethereum_Module.callContractView({
    address: address,
    method: "function totalSupply() external view returns (uint)",
    args: [],
    connection: null,
  });

  if (totalSupplyResult.isOk) {
    return Box.from(BigInt.fromString(totalSupplyResult.unwrap()));
  }

  return null;
}

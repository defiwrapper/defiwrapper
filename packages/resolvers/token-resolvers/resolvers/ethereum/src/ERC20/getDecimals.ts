import { BigInt } from "@polywrap/wasm-as";
import { Box } from "as-container";

import { Ethereum_Module } from "../wrap";

export function getDecimals(address: string): Box<i32> | null {
  if (address.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Module.getNetwork({ connection: null }).unwrap();
    return network.chainId == BigInt.ONE ? Box.from(18) : null;
  }
  const decimalsResult = Ethereum_Module.callContractView({
    address: address,
    method: "function decimals() external view returns (uint8)",
    args: [],
    connection: null,
  });

  if (decimalsResult.isOk) {
    const decimals = decimalsResult.unwrap();
    if (decimals) return Box.from(I32.parseInt(decimals));
  }

  return null;
}

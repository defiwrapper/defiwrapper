import { BigInt } from "@polywrap/wasm-as";

import { hexToUtfStr } from "../utils";
import { Ethereum_Module } from "../wrap";

export function getSymbol(address: string): string | null {
  if (address.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Module.getNetwork({}).unwrap();
    return network.chainId == BigInt.ONE ? "ETH" : null;
  }
  const symbolResult = Ethereum_Module.callContractView({
    address: address,
    method: "function symbol() external view returns (string memory)",
    args: [],
    connection: null,
  });
  if (symbolResult.isOk) return symbolResult.unwrap();

  // FIXME: This won't work since first call is throwing an error in case of symbol isn't string
  const bytesSymbolResult = Ethereum_Module.callContractView({
    address: address,
    method: "function symbol() external view returns (bytes32)",
    args: [],
    connection: null,
  });
  if (bytesSymbolResult.isOk) return hexToUtfStr(bytesSymbolResult.unwrap());

  return null;
}

import { BigInt } from "@polywrap/wasm-as";

import { hexToUtfStr } from "../utils";
import { Ethereum_Connection, Ethereum_Module } from "../wrap";

export function getSymbol(address: string, connection: Ethereum_Connection): string | null {
  if (address.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Module.getNetwork({ connection }).unwrap();
    return network.chainId == BigInt.ONE ? "ETH" : null;
  }
  const symbolResult = Ethereum_Module.callContractView({
    address: address,
    method: "function symbol() external view returns (string memory)",
    args: [],
    connection: connection,
  });
  if (symbolResult.isOk) return symbolResult.unwrap();

  // FIXME: This won't work since first call is throwing an error in case of symbol isn't string
  const bytesSymbolResult = Ethereum_Module.callContractView({
    address: address,
    method: "function symbol() external view returns (bytes32)",
    args: [],
    connection: connection,
  });
  if (bytesSymbolResult.isOk) return hexToUtfStr(bytesSymbolResult.unwrap());

  return null;
}

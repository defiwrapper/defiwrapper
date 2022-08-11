import { BigInt } from "@polywrap/wasm-as";

import { hexToUtfStr } from "../utils";
import { Ethereum_Connection, Ethereum_Module } from "../wrap";

export function getName(address: string): string | null {
  if (address.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Module.getNetwork({}).unwrap();
    return network.chainId == BigInt.ONE ? "Ether" : null;
  }
  const nameResult = Ethereum_Module.callContractView({
    address: address,
    method: "function name() external view returns (string memory)",
    args: []
  });
  if (nameResult.isOk) return nameResult.unwrap();

  // FIXME: This won't work since first call is throwing an error in case of symbol isn't string
  const bytesNameResult = Ethereum_Module.callContractView({
    address: address,
    method: "function name() external view returns (bytes32)",
    args: []
  });
  if (bytesNameResult.isOk) return hexToUtfStr(bytesNameResult.unwrap());

  return null;
}

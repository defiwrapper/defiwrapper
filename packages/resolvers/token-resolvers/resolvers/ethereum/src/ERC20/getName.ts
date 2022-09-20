import { BigInt } from "@polywrap/wasm-as";

import { hexToUtfStr } from "../utils";
import { Ethereum_Module } from "../wrap";

export function getName(address: string): string | null {
  if (address.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    const network = Ethereum_Module.getNetwork({ connection: null }).unwrap();
    return network.chainId == BigInt.ONE ? "Ether" : null;
  }
  const nameResult = Ethereum_Module.callContractView({
    address: address,
    method: "function name() external view returns (string memory)",
    args: [],
    connection: null,
  });
  if (nameResult.isOk) return nameResult.unwrap();

  const bytesNameResult = Ethereum_Module.callContractView({
    address: address,
    method: "function name() external view returns (bytes32)",
    args: [],
    connection: null,
  });
  if (bytesNameResult.isOk) return hexToUtfStr(bytesNameResult.unwrap());

  return null;
}

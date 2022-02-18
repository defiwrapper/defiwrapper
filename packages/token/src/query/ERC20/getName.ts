import { Nullable } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";
import { hexToUtfStr } from "../utils";

export function getName(address: string, connection: Ethereum_Connection): Nullable<string> {
  const nameResult = Ethereum_Query.callContractView({
    address: address,
    method: "function name() external pure returns (string memory)",
    args: [],
    connection: connection,
  });
  if (nameResult.isOk) return Nullable.fromValue(nameResult.unwrap());

  const bytesNameResult = Ethereum_Query.callContractView({
    address: address,
    method: "function name() external pure returns (bytes32 memory)",
    args: [],
    connection: connection,
  });
  if (bytesNameResult.isOk) return Nullable.fromValue(hexToUtfStr(bytesNameResult.unwrap()));

  return Nullable.fromNull<string>();
}

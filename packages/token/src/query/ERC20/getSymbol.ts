import { Nullable } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";
import { hexToUtfStr } from "../utils";

export function getSymbol(address: string, connection: Ethereum_Connection): Nullable<string> {
  const symbolResult = Ethereum_Query.callContractView({
    address: address,
    method: "function symbol() external pure returns (string memory)",
    args: [],
    connection: connection,
  });
  if (symbolResult.isOk) return Nullable.fromValue(symbolResult.unwrap());

  const bytesSymbolResult = Ethereum_Query.callContractView({
    address: address,
    method: "function symbol() external pure returns (bytes32 memory)",
    args: [],
    connection: connection,
  });
  if (bytesSymbolResult.isOk) return Nullable.fromValue(hexToUtfStr(bytesSymbolResult.unwrap()));

  return Nullable.fromNull<string>();
}

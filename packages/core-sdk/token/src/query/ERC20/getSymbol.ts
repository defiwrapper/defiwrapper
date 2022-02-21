import { Ethereum_Connection, Ethereum_Query } from "../w3";
import { hexToUtfStr } from "../utils";

export function getSymbol(address: string, connection: Ethereum_Connection): string | null {
  const symbolResult = Ethereum_Query.callContractView({
    address: address,
    method: "function symbol() external view returns (string memory)",
    args: [],
    connection: connection,
  });
  if (symbolResult.isOk) return symbolResult.unwrap();

  // FIXME: This won't work since first call is throwing an error in case of symbol isn't string
  const bytesSymbolResult = Ethereum_Query.callContractView({
    address: address,
    method: "function symbol() external view returns (bytes32)",
    args: [],
    connection: connection,
  });
  if (bytesSymbolResult.isOk) return hexToUtfStr(bytesSymbolResult.unwrap());

  return null;
}

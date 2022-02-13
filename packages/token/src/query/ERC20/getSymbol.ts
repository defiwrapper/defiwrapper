import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";
import { hexToUtfStr } from "../utils";

export function getSymbol(address: string, connection: Ethereum_Connection): string {
  const symbol: string = Ethereum_Query.callContractView({
    address: address,
    method: "function symbol() external pure returns (string memory)",
    args: [],
    connection: connection,
  });
  if (symbol) return symbol;

  // FIXME: This won't work since first call is throwing an error in case of symbol isn't string
  const bytesSymbol: string = Ethereum_Query.callContractView({
    address: address,
    method: "function symbol() external pure returns (bytes32 memory)",
    args: [],
    connection: connection,
  });
  if (bytesSymbol) return hexToUtfStr(bytesSymbol);

  return "Unknown";
}

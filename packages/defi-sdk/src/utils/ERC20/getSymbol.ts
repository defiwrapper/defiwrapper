import { Ethereum_Query, Ethereum_Connection } from "../../query/w3";

export function getSymbol(
  address: string,
  connection: Ethereum_Connection
): string {
  const symbol: string = Ethereum_Query.callContractView({
    address: address,
    method: "function symbol() external pure returns (string memory)",
    args: [],
    connection: connection,
  });
  return symbol ? symbol : "Unknown";
}

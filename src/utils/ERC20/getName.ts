import { Ethereum_Query, Ethereum_Connection } from "../../query/w3";

export function getName(
  address: string,
  connection: Ethereum_Connection
): string {
  const name: string = Ethereum_Query.callContractView({
    address: address,
    method: "function name() external pure returns (string memory)",
    args: [],
    connection: connection,
  });
  return name ? name : "Unknown";
}

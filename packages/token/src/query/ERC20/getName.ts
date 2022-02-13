import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";
import { hexToUtfStr } from "../utils";

export function getName(address: string, connection: Ethereum_Connection): string {
  const name: string = Ethereum_Query.callContractView({
    address: address,
    method: "function name() external pure returns (string memory)",
    args: [],
    connection: connection,
  });
  if (name) return name;

  // FIXME: This won't work since first call is throwing an error in case of symbol isn't string
  const bytesName: string = Ethereum_Query.callContractView({
    address: address,
    method: "function name() external pure returns (bytes32 memory)",
    args: [],
    connection: connection,
  });
  if (bytesName) return hexToUtfStr(bytesName);

  return "Unknown";
}

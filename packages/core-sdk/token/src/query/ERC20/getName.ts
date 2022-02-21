import { Ethereum_Connection, Ethereum_Query } from "../w3";
import { hexToUtfStr } from "../utils";

export function getName(address: string, connection: Ethereum_Connection): string | null {
  const nameResult = Ethereum_Query.callContractView({
    address: address,
    method: "function name() external view returns (string memory)",
    args: [],
    connection: connection,
  });
  if (nameResult.isOk) return nameResult.unwrap();

  // FIXME: This won't work since first call is throwing an error in case of symbol isn't string
  const bytesNameResult = Ethereum_Query.callContractView({
    address: address,
    method: "function name() external view returns (bytes32)",
    args: [],
    connection: connection,
  });
  if (bytesNameResult.isOk) return hexToUtfStr(bytesNameResult.unwrap());

  return null;
}

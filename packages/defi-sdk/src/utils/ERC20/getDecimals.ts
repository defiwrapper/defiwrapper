import { Ethereum_Connection, Ethereum_Query } from "../../query/w3";

export function getDecimals(address: string, connection: Ethereum_Connection): i32 {
  const decimals: string = Ethereum_Query.callContractView({
    address: address,
    method: "function decimals() external pure returns (uint8)",
    args: [],
    connection: connection,
  });
  return decimals ? I32.parseInt(decimals) : -1;
}

import { Ethereum_Connection, Ethereum_Query } from "../w3";

/* Example of a standard approach to obtaining underlying token addresses.
 * The correct method varies by protocol.
 */
export function getPoolTokenAddresses(
  poolAddress: string,
  connection: Ethereum_Connection,
): string[] {
  const addressesRes = Ethereum_Query.callContractView({
    address: poolAddress,
    method: "function tokens() external view returns (address, address)",
    args: [],
    connection: connection,
  });
  if (addressesRes.isErr) {
    throw new Error("Invalid protocol token");
  }
  return addressesRes.unwrap().split(",");
}

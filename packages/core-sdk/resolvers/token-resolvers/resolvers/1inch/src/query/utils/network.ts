import { Ethereum_Connection, Ethereum_Network, Ethereum_Query } from "../w3";

export function getChainId(connection: Ethereum_Connection): i32 {
  const chainIdRes = Ethereum_Query.getNetwork({ connection });
  if (chainIdRes.isErr) {
    return 0;
  }
  const network: Ethereum_Network = chainIdRes.unwrap();
  return network.chainId;
}

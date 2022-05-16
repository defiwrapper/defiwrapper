import { BigInt } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Network, Ethereum_Query } from "../w3";

export function getChainId(connection: Ethereum_Connection): BigInt | null {
  const chainIdRes = Ethereum_Query.getNetwork({ connection });
  if (chainIdRes.isErr) {
    return null;
  }
  const network: Ethereum_Network = chainIdRes.unwrap();
  return network.chainId;
}

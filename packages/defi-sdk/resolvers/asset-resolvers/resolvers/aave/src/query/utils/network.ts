import { BigInt } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Network, Ethereum_Query } from "../w3";

export function getChainId(connection: Ethereum_Connection): BigInt {
  const networkRes = Ethereum_Query.getNetwork({ connection });
  if (networkRes.isErr) {
    return BigInt.ZERO;
  }
  const network: Ethereum_Network = networkRes.unwrap();
  return network.chainId;
}

import { BigInt } from "@polywrap/wasm-as";

import { Ethereum_Connection, Ethereum_Module, Ethereum_Network } from "../wrap";

export function getChainId(connection: Ethereum_Connection): BigInt | null {
  const networkRes = Ethereum_Module.getNetwork({ connection });
  if (networkRes.isErr) {
    return null;
  }
  const network: Ethereum_Network = networkRes.unwrap();
  return network.chainId;
}

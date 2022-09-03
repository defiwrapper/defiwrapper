import { BigInt } from "@polywrap/wasm-as";

import { Ethereum_Connection, Ethereum_Module, Ethereum_Network } from "../wrap";

export function getChainId(connection: Ethereum_Connection): BigInt | null {
  const chainIdRes = Ethereum_Module.getNetwork({ connection });
  if (chainIdRes.isErr) {
    return null;
  }
  const network: Ethereum_Network = chainIdRes.unwrap();
  return network.chainId;
}

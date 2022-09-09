import { BigInt } from "@polywrap/wasm-as";

import { Ethereum_Module, Ethereum_Network } from "../wrap";

export function getChainId(): BigInt | null {
  const chainIdRes = Ethereum_Module.getNetwork({ connection: null });
  if (chainIdRes.isErr) {
    return null;
  }
  const network: Ethereum_Network = chainIdRes.unwrap();
  return network.chainId;
}

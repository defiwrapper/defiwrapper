import { BigInt } from "@polywrap/wasm-as";

import { Ethereum_Module, Ethereum_Network } from "../wrap";

export function getChainId(): BigInt | null {
  const networkRes = Ethereum_Module.getNetwork({ connection: null });
  if (networkRes.isErr) {
    return null;
  }
  const network: Ethereum_Network = networkRes.unwrap();
  return network.chainId;
}

import { BigInt } from "@polywrap/wasm-as";

import { Ethereum_Module, Ethereum_Network } from "../wrap";

export function getChainId(): BigInt {
  const networkRes = Ethereum_Module.getNetwork({ connection: null });
  if (networkRes.isErr) {
    return BigInt.ZERO;
  }
  const network: Ethereum_Network = networkRes.unwrap();
  return network.chainId;
}

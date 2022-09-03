import { BigInt } from "@polywrap/wasm-as";

import { Ethereum_Connection, Ethereum_Module, Ethereum_Network } from "../wrap";

export function getChainId(connection: Ethereum_Connection): BigInt {
  const networkRes = Ethereum_Module.getNetwork({ connection });
  if (networkRes.isErr) {
    return BigInt.ZERO;
  }
  const network: Ethereum_Network = networkRes.unwrap();
  return network.chainId;
}

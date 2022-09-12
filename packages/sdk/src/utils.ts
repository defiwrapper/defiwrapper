import { Ethereum_Module, TokenResolver_Module } from "./wrap";

export function getTokenResolver(): TokenResolver_Module {
  const network = Ethereum_Module.getNetwork({ connection: null }).unwrap();

  if (network.chainId.eq(1)) {
    return new TokenResolver_Module("ens/ethereum.token.resolvers.defiwrapper.eth");
  }

  throw new Error("Unknown network with chainId: " + network.chainId.toString());
}

import { TokenResolver_Module } from "./wrap";

export function getTokenResolverModule(chainId: i32): TokenResolver_Module {
  if (chainId == 1) {
    return new TokenResolver_Module("ens/ethereum.token.resolvers.defiwrapper.eth");
  } else {
    throw new Error("Unsupported chainId");
  }
}

export function getNetworkId(chainId: i32): string {
  switch (chainId) {
    case 1:
      return "ethereum";
    default:
      throw Error("Invalid chainid: " + chainId);
  }
}

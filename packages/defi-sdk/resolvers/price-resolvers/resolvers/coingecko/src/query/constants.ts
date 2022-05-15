import { TokenResolver_Query } from "./w3";

export function getTokenResolverQuery(chainId: i32): TokenResolver_Query {
  if (chainId == 1) {
    return new TokenResolver_Query("ens/ethereum.token.resolvers.defiwrapper.eth");
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

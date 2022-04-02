import { TokenResolver_Query } from "./w3";

export function getTokenResolverQuery(chainId: string): TokenResolver_Query {
  if (chainId == "1") {
    return new TokenResolver_Query("ens/ethereum.token-resolvers.defiwrapper.eth");
  } else {
    throw new Error("Unsupported chainId: " + chainId);
  }
}

import { PolywrapClientConfig } from "@polywrap/client-js";

import { getConfig, getWrapperPaths } from "../config/util";

export function getClientConfig(_: Partial<PolywrapClientConfig>): Partial<PolywrapClientConfig> {
  const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
  const wrapperUri = `fs/${wrapperAbsPath}/build`;
  const tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
  const coingecokUri = "ens/rinkeby/coingecko.defiwrapper.eth";
  const mainnetProvider = "http://localhost:8546";

  return getConfig(wrapperUri, tokenResolverUri, coingecokUri, mainnetProvider);
}

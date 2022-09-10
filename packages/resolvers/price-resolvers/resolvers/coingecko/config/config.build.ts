import { PolywrapClientConfig } from "@polywrap/client-js";

import { getConfig, getWrapperPaths } from "./util";

export function getClientConfig(_: Partial<PolywrapClientConfig>): Partial<PolywrapClientConfig> {
  const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
  const wrapperUri = `fs/${wrapperAbsPath}/build`;
  const tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
  const mainnetProvider = "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6";

  return getConfig(wrapperUri, tokenResolverUri, mainnetProvider);
}

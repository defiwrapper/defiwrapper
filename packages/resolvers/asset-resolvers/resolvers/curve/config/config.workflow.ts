import { PolywrapClientConfig } from "@polywrap/client-js";

import { getConfig, getWrapperPaths } from "./util";

export function getClientConfig(_: Partial<PolywrapClientConfig>): Partial<PolywrapClientConfig> {
  const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
  const wrapperUri = `fs/${wrapperAbsPath}/build`;
  const tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;

  return getConfig(wrapperUri, tokenResolverUri);
}

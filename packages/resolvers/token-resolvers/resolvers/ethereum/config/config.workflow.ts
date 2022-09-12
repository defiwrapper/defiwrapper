import { PolywrapClientConfig } from "@polywrap/client-js";

import { getConfig, getWrapperPath } from "./util";

export function getClientConfig(_: Partial<PolywrapClientConfig>): Partial<PolywrapClientConfig> {
  const wrapperAbsPath = getWrapperPath();
  const wrapperUri = `fs/${wrapperAbsPath}/build`;
  const mainnetProvider = "http://localhost:8546";

  return getConfig(wrapperUri, mainnetProvider);
}

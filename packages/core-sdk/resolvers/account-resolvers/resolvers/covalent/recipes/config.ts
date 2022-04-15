import { Web3ApiClientConfig } from "@web3api/client-js";

export function getClientConfig(
  defaultConfigs: Partial<Web3ApiClientConfig>,
): Partial<Web3ApiClientConfig> {
  const covalentEnv = {
    uri: "ens/rinkeby/covalent.account.resolvers.defiwrapper.eth",
    query: {
      apiKey: "ckey_910089969da7451cadf38655ede",
      chainId: 1,
    },
    common: {},
    mutation: {},
  };
  const tokenEnv = {
    uri: "w3://ens/rinkeby/ethereum.token.resolvers.defiwrapper.eth",
    query: {
      connection: {
        networkNameOrChainId: "MAINNET",
      },
    },
    common: {},
    mutation: {},
  };
  defaultConfigs.envs = defaultConfigs.envs
    ? [...defaultConfigs.envs, covalentEnv, tokenEnv]
    : [covalentEnv, tokenEnv];

  const tokenRedirect = {
    to: "ens/rinkeby/ethereum.token.resolvers.defiwrapper.eth",
    from: "ens/ethereum.token-resolvers.defiwrapper.eth",
  };
  defaultConfigs.redirects = defaultConfigs.redirects
    ? [...defaultConfigs.redirects, tokenRedirect]
    : [tokenRedirect];
  return defaultConfigs;
}

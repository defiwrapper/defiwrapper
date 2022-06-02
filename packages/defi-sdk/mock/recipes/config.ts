import { Web3ApiClientConfig } from "@web3api/client-js";

export function getClientConfig(
  defaultConfigs: Partial<Web3ApiClientConfig>,
): Partial<Web3ApiClientConfig> {
  const mainEnv = {
    uri: "w3://ens/ethereum.web3api.eth",
    common: {
      connection: {
        node: null,
        networkNameOrChainId: "1",
      },
    },
    query: {},
    mutation: {},
  };
  const covalentEnv = {
    uri: "w3://ens/mock.account.resolvers.defiwrapper.eth",
    query: {
      apiKey: "ckey_910089969da7451cadf38655ede",
      chainId: 1,
      vsCurrency: "USD",
      format: 0,
    },
    common: {},
    mutation: {},
  };
  defaultConfigs.envs = defaultConfigs.envs
    ? [...defaultConfigs.envs, mainEnv, covalentEnv]
    : [mainEnv, covalentEnv];

  const accountResolverRedirect = {
    from: "w3://ens/mock.account.resolvers.defiwrapper.eth",
    to: "w3://ipfs/QmdkRohQ2DJvRnJvGXc6SN6qwdnGFUA3ceGtMvGy1eEdjz",
  };
  const mainRedirect = {
    from: "w3://ens/mock-sdk.defiwrapper.eth",
    to: "w3://ipfs/QmW18rDiottNWEtBu8ZAaiot4Hn7y6Pmq9cvazdJCm1W2Q",
  };
  defaultConfigs.redirects = defaultConfigs.redirects
    ? [...defaultConfigs.redirects, accountResolverRedirect, mainRedirect]
    : [accountResolverRedirect, mainRedirect];

  return defaultConfigs;
}

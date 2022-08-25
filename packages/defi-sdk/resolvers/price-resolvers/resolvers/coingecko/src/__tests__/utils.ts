import { ClientConfig } from "@polywrap/client-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";

export function getConfig(
  wrapperUri: string,
  tokenUri: string,
  coingeckoUri: string,
): Partial<ClientConfig> {
  return {
    redirects: [
      {
        to: tokenUri,
        from: "ens/ethereum.token.resolvers.defiwrapper.eth",
      },
      {
        to: coingeckoUri,
        from: "ens/coingecko.defiwrapper.eth",
      },
    ],
    envs: [
      {
        uri: wrapperUri,
        env: {
          connection: {
            networkNameOrChainId: "MAINNET",
          },
        },
      },
      {
        uri: tokenUri,
        env: {
          connection: {
            networkNameOrChainId: "MAINNET",
          },
        },
      },
    ],
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          networks: {
            MAINNET: {
              provider: "http://localhost:8546",
            },
          },
          defaultNetwork: "mainnet",
        }),
      },
    ],
    interfaces: [
      {
        interface: "ens/interface.token.resolvers.defiwrapper.eth",
        implementations: ["ens/ethereum.token.resolvers.defiwrapper.eth"],
      },
    ],
  };
}

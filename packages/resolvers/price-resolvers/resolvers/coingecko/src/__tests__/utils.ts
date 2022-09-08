import { ClientConfig } from "@polywrap/client-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";

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
          connections: new Connections({
            networks: {
              mainnet: new Connection({
                provider: "http://localhost:8546",
              }),
              rinkeby: new Connection({
                provider: "https://rinkeby.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
              }),
            },
            defaultNetwork: "mainnet",
          }),
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

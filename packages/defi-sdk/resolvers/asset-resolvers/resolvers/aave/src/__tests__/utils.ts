import { ClientConfig } from "@polywrap/client-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";

export function getConfig(protocolUri: string): Partial<ClientConfig> {
  return {
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          networks: {
            mainnet: {
              provider: "http://localhost:8546",
            },
          },
          defaultNetwork: "mainnet",
        }),
      },
    ],
    envs: [
      {
        uri: protocolUri,
        env: {
          connection: {
            networkNameOrChainId: "mainnet",
          },
        },
      },
    ],
  };
}

import { ClientConfig } from "@polywrap/client-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";

export function getConfig(protocolUri: string): Partial<ClientConfig> {
  return {
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          connections: new Connections({
            networks: {
              mainnet: Connection.fromNode("http://localhost:8546"),
            },
            defaultNetwork: "mainnet",
          }),
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

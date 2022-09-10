import { ClientConfig } from "@polywrap/client-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import path from "path";

export function getConfig(wrapperUri: string, mainnetProvider: string): Partial<ClientConfig> {
  return {
    redirects: [
      {
        from: "wrap://ens/ethereum.token.resolvers.defiwrapper.eth",
        to: wrapperUri,
      },
    ],
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          connections: new Connections({
            networks: {
              mainnet: new Connection({ provider: mainnetProvider }),
            },
            defaultNetwork: "mainnet",
          }),
        }),
      },
    ],
  };
}

export function getWrapperPath(): string {
  const wrapperRelPath: string = path.join(__dirname, "..");
  return path.resolve(wrapperRelPath);
}

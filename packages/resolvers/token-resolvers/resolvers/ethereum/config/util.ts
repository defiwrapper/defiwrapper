import { ClientConfig } from "@polywrap/client-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const INFURA_KEY = process.env.INFURA_KEY || "b00b2c2cc09c487685e9fb061256d6a6";

export function getConfig(wrapperUri: string): Partial<ClientConfig> {
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
              mainnet: new Connection({ provider: `https://mainnet.infura.io/v3/${INFURA_KEY}` }),
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

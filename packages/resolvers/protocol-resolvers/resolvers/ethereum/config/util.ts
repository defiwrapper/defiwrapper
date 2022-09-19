import { ClientConfig } from "@polywrap/client-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const INFURA_ID =
  process.env.INFURA_ID || "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6";

export function getConfig(wrapperUri: string, tokenResolverUri: string): Partial<ClientConfig> {
  return {
    redirects: [
      {
        from: "wrap://ens/ethereum.token.resolvers.defiwrapper.eth",
        to: tokenResolverUri,
      },
      {
        from: "ens/ethereum.protocol.resolvers.defiwrapper.eth",
        to: wrapperUri,
      },
    ],
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          connections: new Connections({
            networks: {
              mainnet: new Connection({ provider: `https://mainnet.infura.io/v3/${INFURA_ID}` }),
            },
            defaultNetwork: "mainnet",
          }),
        }),
      },
    ],
    envs: [
      {
        uri: wrapperUri,
        env: {
          connection: {
            networkNameOrChainId: "mainnet",
          },
        },
      },
      {
        uri: tokenResolverUri,
        env: {
          connection: {
            networkNameOrChainId: "mainnet",
          },
        },
      },
    ],
  };
}

export function getWrapperPaths(): { wrapperAbsPath: string; tokenResolverAbsPath: string } {
  const wrapperRelPath: string = path.join(__dirname, "..");
  const wrapperAbsPath: string = path.resolve(wrapperRelPath);
  const tokenRelPath: string = path.join(
    wrapperAbsPath,
    "../../..",
    "token-resolvers",
    "resolvers",
    "ethereum",
  );
  const tokenResolverAbsPath = path.resolve(tokenRelPath);

  return { wrapperAbsPath, tokenResolverAbsPath };
}

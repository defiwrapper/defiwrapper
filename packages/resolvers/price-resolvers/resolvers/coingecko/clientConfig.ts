import { PolywrapClientConfig } from "@polywrap/client-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";

export function getClientConfig(_: Partial<PolywrapClientConfig>): Partial<PolywrapClientConfig> {
  return {
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          connections: new Connections({
            networks: {
              mainnet: new Connection({
                provider: "b00b2c2cc09c487685e9fb061256d6a6",
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
  };
}

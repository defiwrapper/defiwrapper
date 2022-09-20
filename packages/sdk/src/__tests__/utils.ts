import { ClientConfig } from "@polywrap/client-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { runCLI } from "@polywrap/test-env-js";
import axios from "axios";
import { execSync } from "child_process";
import * as dotenv from "dotenv";

dotenv.config();

const INFURA_KEY = process.env.INFURA_KEY || "b00b2c2cc09c487685e9fb061256d6a6";

export async function buildWrapper(wrapperAbsPath: string): Promise<void> {
  execSync(`yarn --cwd ${wrapperAbsPath} build`);
}

async function awaitResponse(
  url: string,
  expectedRes: string,
  getPost: "get" | "post",
  timeout: number,
  maxTimeout: number,
  data?: string,
): Promise<boolean> {
  let time = 0;

  while (time < maxTimeout) {
    const request = getPost === "get" ? axios.get(url) : axios.post(url, data);
    const success = await request
      .then(function (response) {
        const responseData = JSON.stringify(response.data);
        return responseData.indexOf(expectedRes) > -1;
      })
      .catch(function () {
        return false;
      });

    if (success) {
      return true;
    }

    await new Promise<void>(function (resolve) {
      setTimeout(() => resolve(), timeout);
    });

    time += timeout;
  }

  return false;
}

export function getClientConfig(
  etrUri: string,
  eprUri: string,
  carUri: string,
  yarUri: string,
  sarUri: string,
  cprUri: string,
  covUri: string,
): Partial<ClientConfig> {
  return {
    redirects: [
      {
        from: "wrap://ens/ethereum.token.resolvers.defiwrapper.eth",
        to: etrUri,
      },
      {
        from: "wrap://ens/ethereum.protocol.resolvers.defiwrapper.eth",
        to: eprUri,
      },
      {
        from: "wrap://ens/curve.asset.resolvers.defiwrapper.eth",
        to: carUri,
      },
      {
        from: "wrap://ens/aave.asset.resolvers.defiwrapper.eth",
        to: yarUri,
      },
      {
        from: "wrap://ens/sushibar.asset.resolvers.defiwrapper.eth",
        to: sarUri,
      },
      {
        from: "wrap://ens/coingecko.price.resolvers.defiwrapper.eth",
        to: cprUri,
      },
      {
        from: "wrap://ens/covalent.account.resolvers.defiwrapper.eth",
        to: covUri,
      },
    ],
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          connections: new Connections({
            networks: {
              mainnet: new Connection({
                provider: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
              }),
              rinkeby: new Connection({
                provider: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
              }),
            },
            defaultNetwork: "mainnet",
          }),
        }),
      },
    ],
    interfaces: [
      {
        interface: "wrap://ens/interface.protocol.resolvers.defiwrapper.eth",
        implementations: [eprUri],
      },
      {
        interface: "wrap://ens/interface.token.resolvers.defiwrapper.eth",
        implementations: [etrUri],
      },
      {
        interface: "wrap://ens/interface.asset.resolvers.defiwrapper.eth",
        implementations: [carUri, sarUri],
      },
      {
        interface: "wrap://ens/interface.price.resolvers.defiwrapper.eth",
        implementations: [cprUri],
      },
      {
        interface: "wrap://ens/interface.account.resolvers.defiwrapper.eth",
        implementations: [covUri],
      },
    ],
    envs: [
      {
        uri: covUri,
        env: {
          apiKey: process.env.COVALENT_API_KEY || "ckey_910089969da7451cadf38655ede",
          chainId: 1,
          vsCurrency: "USD",
          format: "_JSON",
        },
      },
    ],
  };
}

export async function initInfra(): Promise<void> {
  const { exitCode, stderr, stdout } = await runCLI({
    args: ["infra", "up", "--verbose"],
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to start test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`,
    );
  }

  const success = await awaitResponse(
    `http://localhost:8546`,
    '"jsonrpc":',
    "post",
    2000,
    20000,
    '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}',
  );
  if (!success) {
    throw Error("initInfra: Ganache failed to start");
  }

  return Promise.resolve();
}

export async function stopInfra(): Promise<void> {
  const { exitCode, stderr, stdout } = await runCLI({
    args: ["infra", "down", "--verbose"],
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to stop test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`,
    );
  }

  return Promise.resolve();
}

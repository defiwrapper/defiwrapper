import { ClientConfig, coreInterfaceUris } from "@polywrap/client-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { runCLI } from "@polywrap/test-env-js";
import axios from "axios";
export interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  registrarAddress: string;
  reverseAddress: string;
  resolverAddress: string;
}

export function getPlugins(
  ethereum: string,
  ipfs: string,
  ensAddress: string,
): Partial<ClientConfig> {
  return {
    redirects: [],
    plugins: [
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: "wrap://ens/ens.polywrap.eth",
        plugin: ensResolverPlugin({ addresses: { testnet: ensAddress } }),
      },
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereum,
            },
            mainnet: {
              provider: "http://localhost:8546",
            },
          },
          defaultNetwork: "mainnet",
        }),
      },
    ],
    interfaces: [
      {
        interface: coreInterfaceUris.uriResolver.uri,
        implementations: ["wrap://ens/ipfs.polywrap.eth", "wrap://ens/ens.polywrap.eth"],
      },
      {
        interface: coreInterfaceUris.logger.uri,
        implementations: ["wrap://ens/js-logger.polywrap.eth"],
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

async function awaitResponse(
  url: string,
  expectedRes: string,
  getPost: "get" | "post",
  timeout: number,
  maxTimeout: number,
  data?: string,
) {
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

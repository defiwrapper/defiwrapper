import { ClientConfig } from "@polywrap/client-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { runCLI } from "@polywrap/test-env-js";
import axios from "axios";

export function getPlugins(): Partial<ClientConfig> {
  return {
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

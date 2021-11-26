import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { Ping } from "./types";

jest.setTimeout(120000);

describe("Coingecko", () => {
  let client: Web3ApiClient;
  let ensUri: string;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const config: ClientConfig = getPlugins(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient(config);
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "..", "..", "..");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("should ping coingecko api", async () => {
    const ping = await client.query<Ping>({
      uri: ensUri,
      query: `
        query {
          ping
        }
      `,
    });
    expect(ping.errors).toBeFalsy();
    expect(ping.data).toBeTruthy();
    expect(ping.data?.ping.gecko_says).toStrictEqual("(V3) To the Moon!");
  });
});

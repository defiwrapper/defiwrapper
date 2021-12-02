import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { Ping, TokenMarketChartResult } from "./types";

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

  it("should get market chart data", async () => {
    const id = "ethereum";
    const contractAddress = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce";
    const vsCurrency = "usd";
    const days = 7;

    const result = await client.query<TokenMarketChartResult>({
      uri: ensUri,
      query: `
        query($id: String!, $contractAddress: String!, $vsCurrency: String!, $days: Int!) {
          tokenMarketChart(
            id: $id
            contract_address: $contractAddress
            vs_currency: $vsCurrency
            days: $days
          )
        }
      `,
      variables: {
        id,
        contractAddress,
        vsCurrency,
        days,
      },
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    // check presence of properties
    expect(result.data?.tokenMarketChart).toHaveProperty("prices");
    expect(result.data?.tokenMarketChart).toHaveProperty("market_caps");
    expect(result.data?.tokenMarketChart).toHaveProperty("total_volumes");

    // check one item for each prop
    expect(result.data?.tokenMarketChart.prices[0]).toBeTruthy();
    expect(result.data?.tokenMarketChart.market_caps[0]).toBeTruthy();
    expect(result.data?.tokenMarketChart.total_volumes[0]).toBeTruthy();
  });
});

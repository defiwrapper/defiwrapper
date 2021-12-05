import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { CoinMarketChartRangeResult, Ping, TokenMarketChartResult } from "./types";

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

  it("should get token market chart data", async () => {
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

  it("should get coin market chart data for a range", async () => {
    const id = "ethereum";
    const vsCurrency = "usd";
    const from = 1638463900;
    const to = 1638465000;

    const result = await client.query<CoinMarketChartRangeResult>({
      uri: ensUri,
      query: `
        query($id: String!, $vsCurrency: String!, $from: UInt!, $to: UInt!) {
          coinMarketChartRange(id: $id, vs_currency: $vsCurrency, from: $from, to: $to)
        }
      `,
      variables: { id, vsCurrency, from, to },
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    // check presence of properties
    expect(result.data?.coinMarketChartRange).toHaveProperty("prices");
    expect(result.data?.coinMarketChartRange).toHaveProperty("market_caps");
    expect(result.data?.coinMarketChartRange).toHaveProperty("total_volumes");

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
      Todo: fix this test
      Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)

      Data granularity is automatic (cannot be adjusted)
      1 day from query time = 5 minute interval data
      1 - 90 days from query time = hourly data
      above 90 days from query time = daily data (00:00 UTC)
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    // // check length of result arrays
    // expect(result.data?.coinMarketChartRange.prices.length).toBe(4);
    // expect(result.data?.coinMarketChartRange.market_caps.length).toBe(4);
    // expect(result.data?.coinMarketChartRange.total_volumes.length).toBe(4);

    // check one item for each prop
    expect(result.data?.coinMarketChartRange.prices[0]).toBeTruthy();
    expect(result.data?.coinMarketChartRange.market_caps[0]).toBeTruthy();
    expect(result.data?.coinMarketChartRange.total_volumes[0]).toBeTruthy();
  });
});

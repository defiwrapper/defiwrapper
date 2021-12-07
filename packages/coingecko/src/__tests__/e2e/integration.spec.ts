import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import {
  CoinHistoryResult,
  CoinMarketChartRangeResult,
  Ping,
  TokenMarketChartResult,
} from "./types";

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

  it("should get history of a coin on specific date", async () => {
    const id = "tron";
    const date = "05-10-2021";

    const result = await client.query<CoinHistoryResult>({
      uri: ensUri,
      query: `
        query($id: String!, $date: String!) {
          coinHistory(id: $id, date: $date)
        }
      `,
      variables: { id, date },
    });

    // check the result
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    // check id, name and symbol
    expect(result.data?.coinHistory.id).toBe("tron");
    expect(result.data?.coinHistory.symbol).toBe("trx");
    expect(result.data?.coinHistory.name).toBe("TRON");

    // check localization array
    expect(result.data?.coinHistory.localization).toHaveLength(21);
    expect(result.data?.coinHistory.localization.find((i) => i.locale === "en")?.text).toBe("TRON");

    // check image
    expect(result.data?.coinHistory.image.small).toBe(
      "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png?1547035066",
    );

    // check market data
    const marketData = result.data?.coinHistory.market_data;
    expect(marketData?.current_price).toHaveLength(61);
    expect(marketData?.current_price.find((i) => i.currency === "eur")?.price).toBe(
      "0.08077519750307671",
    );
    expect(marketData?.market_cap).toHaveLength(61);
    expect(marketData?.market_cap.find((i) => i.currency === "usd")?.market_cap).toBe(
      "6739064613.560965",
    );
    expect(marketData?.total_volume).toHaveLength(61);
    expect(marketData?.total_volume.find((i) => i.currency === "btc")?.volume).toBe(
      "25189.190086476403",
    );

    // check community data
    const communityData = result.data?.coinHistory.community_data;
    expect(communityData?.twitter_followers).toBe(1158147);
    expect(communityData?.reddit_average_comments_48h).toBe("14.545");

    // check developer data
    const developerData = result.data?.coinHistory.developer_data;
    expect(developerData?.forks).toBe(965);
    expect(developerData?.pull_requests_merged).toBe(2493);
    expect(developerData?.code_additions_deletions_4_weeks?.additions).toBe(0);

    // check public interest stats
    const publicInterestStats = result.data?.coinHistory.public_interest_stats;
    expect(publicInterestStats?.alexa_rank).toBe(33166);
    expect(publicInterestStats?.bing_matches).toBeNull();
  });

  it("should throw error when date is not valid", async () => {
    const id = "tron";
    const date = "z-10-2021";

    const result = await client.query<CoinHistoryResult>({
      uri: ensUri,
      query: `
        query($id: String!, $date: String!) {
          coinHistory(id: $id, date: $date)
        }
      `,
      variables: { id, date },
    });

    // check the result
    expect(result.errors).toBeTruthy();

    expect(result.errors?.[0].message.match(/Message: __w3_abort: invalid date/)).toHaveLength(1);
  });
});

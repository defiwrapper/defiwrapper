import { InvokeResult, PolywrapClient } from "@polywrap/client-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Coingecko_Module } from "../types/wrap";
import { buildWrapper } from "../utils";

jest.setTimeout(500000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let wrapperUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    // deploy api
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenUri = `fs/${tokenResolverAbsPath}/build`;
    wrapperUri = `fs/${wrapperAbsPath}/build`;

    // get client
    const config = getConfig(wrapperUri, tokenUri);
    client = new PolywrapClient(config);
  });

  describe("getTokenPrice", () => {
    test("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", async () => {
      const result = await Coingecko_Module.getTokenPrice(
        {
          tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          vsCurrencies: ["usd"],
        },
        client,
        wrapperUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      const tokenPrice = result.value;
      expect(tokenPrice.token).toMatchObject({
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
      });
      expect(tokenPrice.balance).toBe("1");
      expect(+tokenPrice.values[0].price).toBeGreaterThan(0);
      expect(tokenPrice.values[0].currency).toBe("usd");
      expect(tokenPrice.values[0].value).toBe(tokenPrice.values[0].price);
    });

    test("0x07a80533c9e5179e99c0ca60a51a552d0c38f0ca", async () => {
      const result = await Coingecko_Module.getTokenPrice(
        { tokenAddress: "0x07a80533c9e5179e99c0ca60a51a552d0c38f0ca", vsCurrencies: ["usd"] },
        client,
        wrapperUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      const tokenPrice = result.value;
      expect(tokenPrice.token).toMatchObject({
        address: "0x07a80533c9e5179e99c0ca60a51a552d0c38f0ca",
        decimals: 18,
        name: "dOrg",
        symbol: "dOrg",
      });
    });
  });
});

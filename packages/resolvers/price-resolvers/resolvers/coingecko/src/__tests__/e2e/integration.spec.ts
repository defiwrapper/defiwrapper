import { InvokeResult, PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import path from "path";

import { Coingecko_PriceResolver_TokenBalance as TokenBalance } from "../types/wrap";
import { getConfig } from "../utils";

jest.setTimeout(500000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let wrapperUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    // deploy api
    const wrapperRelPath: string = path.join(__dirname, "../../..");
    const wrapperAbsPath: string = path.resolve(wrapperRelPath);
    await buildWrapper(wrapperAbsPath);
    wrapperUri = `fs/${wrapperAbsPath}/build`;

    const tokenRelPath: string = path.join(
      wrapperAbsPath,
      "../../..",
      "token-resolvers",
      "resolvers",
      "ethereum",
    );
    const tokenAbsPath = path.resolve(tokenRelPath);
    await buildWrapper(tokenAbsPath);
    tokenUri = `fs/${tokenAbsPath}/build`;

    // get client
    const config = getConfig(tokenUri);
    client = new PolywrapClient(config);
  });

  describe("getTokenPrice", () => {
    const getTokenPrice = async (address: string): Promise<InvokeResult<TokenBalance>> => {
      return client.invoke<TokenBalance>({
        uri: wrapperUri,
        method: "getTokenPrice",
        args: {
          tokenAddress: address,
          balance: "1",
          vsCurrencies: ["usd"],
        },
      });
    };

    test("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", async () => {
      const result = await getTokenPrice("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      const tokenPrice: TokenBalance = result.data as TokenBalance;
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
  });
});

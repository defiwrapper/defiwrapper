import { InvokeResult, PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Coingecko_PriceResolver_TokenBalance as TokenBalance } from "../types/wrap";

jest.setTimeout(500000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let wrapperUri: string;
  let tokenUri: string;
  const coingeckUri = `ens/rinkeby/coingecko.defiwrapper.eth`;

  beforeAll(async () => {
    // deploy api
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenUri = `fs/${tokenResolverAbsPath}/build`;
    wrapperUri = `fs/${wrapperAbsPath}/build`;

    // get client
    const config = getConfig(wrapperUri, tokenUri, coingeckUri, "http://localhost:8546");
    client = new PolywrapClient(config);
  });

  describe("getTokenPrice", () => {
    const getTokenPrice = async (address: string): Promise<InvokeResult<TokenBalance>> => {
      return client.invoke<TokenBalance>({
        uri: wrapperUri,
        method: "getTokenPrice",
        args: {
          tokenAddress: address,
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

import { InterfaceImplementations, QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { GetTokenPriceResponse, TokenBalance } from "./types";

jest.setTimeout(500000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let ensUri: string;
  let tokenEnsUri: string;
  let coingeckoEnsUri: string;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "..", "..", "..", "..");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;

    const tokenApiPath: string = path.join(
      apiPath,
      "..",
      "..",
      "..",
      "token-resolvers",
      "resolvers",
      "ethereum",
    );
    const tokenApi = await buildAndDeployApi(tokenApiPath, ipfs, ensAddress);
    tokenEnsUri = `ens/testnet/${tokenApi.ensDomain}`;

    // deploy coingecko defiwrapper
    const geckoApiPath: string = path.join(apiPath, "..", "..", "..", "..", "..", "coingecko");
    const geckoApi = await buildAndDeployApi(geckoApiPath, ipfs, ensAddress);
    coingeckoEnsUri = `ens/testnet/${geckoApi.ensDomain}`;
    // get client
    const config = getPlugins(testEnvEtherem, ipfs, ensAddress);
    config.envs = [
      {
        uri: ensUri,
        query: {
          connection: {
            networkNameOrChainId: "1",
          },
        },
      },
      {
        uri: tokenEnsUri,
        query: {
          connection: {
            networkNameOrChainId: "1",
          },
        },
      },
    ];
    const newRedirects = [
      {
        to: tokenEnsUri,
        from: "ens/ethereum.token-resolvers.defiwrapper.eth",
      },
      {
        to: coingeckoEnsUri,
        from: "ens/coingecko.defiwrapper.eth",
      },
    ];
    const ethInterface: InterfaceImplementations<string> = {
      interface: "ens/interface.token-resolvers.defiwrapper.eth",
      implementations: [tokenEnsUri],
    };
    config.interfaces = config.interfaces ? [...config.interfaces, ethInterface] : [ethInterface];
    config.redirects = config.redirects ? [...config.redirects, ...newRedirects] : newRedirects;

    client = new Web3ApiClient(config);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("getTokenPrice", () => {
    const getTokenPrice = async (
      address: string,
    ): Promise<QueryApiResult<GetTokenPriceResponse>> => {
      const response = await client.query<GetTokenPriceResponse>({
        uri: ensUri,
        query: `
          query GetTokenPrice($address: String!) {
            getTokenPrice(
              tokenAddress: $address
              vsCurrencies: $currencies
            )
          }
        `,
        variables: {
          address: address,
          currencies: ["usd"],
        },
      });
      return response;
    };

    test("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", async () => {
      const result = await getTokenPrice("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      const tokenPrice = result.data?.getTokenPrice as TokenBalance;
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

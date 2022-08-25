import { InvokeResult, PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import path from "path";

import { getPlugins, initInfra, stopInfra } from "../utils";
import { GetTokenResponse, TokenType } from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let fsUri: string;

  beforeAll(async () => {
    await initInfra();
    // get client
    const clientConfig = getPlugins();
    client = new PolywrapClient(clientConfig);

    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "../../..");
    await buildWrapper(apiPath);
    fsUri = `fs/${apiPath}/build`;
  });

  afterAll(async () => {
    await stopInfra();
  });

  describe("getToken", () => {
    const getToken = async (
      tokenAddress: string,
      tokenType: TokenType,
    ): Promise<InvokeResult<GetTokenResponse>> => {
      return await client.invoke({
        uri: fsUri,
        method: "getToken",
        args: {
          address: tokenAddress,
          type: tokenType,
        },
        config: {
          envs: [
            {
              uri: fsUri,
              env: {
                connection: {
                  networkNameOrChainId: "MAINNET",
                },
              },
            },
          ],
        },
      });
    };

    test("USDC", async () => {
      const response = await getToken(
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        TokenType.ERC20,
      );
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
      });
    });

    test("SAI", async () => {
      const response = await getToken(
        "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
        TokenType.ERC20,
      );
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
        name: "Dai Stablecoin v1.0",
        symbol: "DAI",
        decimals: 18,
      });
    });

    test("ETH", async () => {
      const response = await getToken(
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        TokenType.ERC20,
      );
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      });
    });
  });
});

import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins, TestEnvironment } from "../utils";
import { TokenType } from "./types";
import { GetTokenResponse } from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let testEnv: TestEnvironment;
  let ensUri: string;

  beforeAll(async () => {
    testEnv = await initTestEnvironment();
    // get client
    const clientConfig = getPlugins(testEnv.ethereum, testEnv.ipfs, testEnv.ensAddress);
    client = new Web3ApiClient(clientConfig);

    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "../../../../");
    const api = await buildAndDeployApi({
      apiAbsPath: apiPath,
      ipfsProvider: testEnv.ipfs,
      ensRegistryAddress: testEnv.ensAddress,
      ensRegistrarAddress: testEnv.registrarAddress,
      ensResolverAddress: testEnv.resolverAddress,
      ethereumProvider: testEnv.ethereum,
    });
    ensUri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("getToken", () => {
    const getToken = async (
      tokenAddress: string,
      tokenType: TokenType,
    ): Promise<QueryApiResult<GetTokenResponse>> => {
      const response = await client.query<GetTokenResponse>({
        uri: ensUri,
        query: `
          query GetToken($tokenAddress: String, $tokenType: TokenType) {
            getToken(
              address: $tokenAddress,
              type: $tokenType
            )
          }
        `,
        variables: {
          tokenAddress: tokenAddress,
          tokenType: tokenType,
        },
        config: {
          envs: [
            {
              uri: ensUri,
              query: {
                connection: {
                  networkNameOrChainId: "MAINNET",
                },
              },
            },
          ],
        },
      });
      return response;
    };
    test("USDC", async () => {
      const response = await getToken(
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        TokenType.ERC20,
      );
      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data?.getToken).toMatchObject({
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
      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data?.getToken).toMatchObject({
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
      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data?.getToken).toMatchObject({
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      });
    });
  });
});

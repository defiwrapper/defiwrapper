import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { TokenType } from "./types";
import { GetTokenResponse } from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let testEnvState: {
    ethereum: string;
    ensAddress: string;
    ipfs: string;
  };
  let coreEnsUri: string;

  beforeAll(async () => {
    testEnvState = await initTestEnvironment();
    // get client
    const clientConfig = getPlugins(
      testEnvState.ethereum,
      testEnvState.ipfs,
      testEnvState.ensAddress,
    );
    client = new Web3ApiClient(clientConfig);

    // deploy api
    const coreApiPath: string = path.join(path.resolve(__dirname), "..", "..", "..", "..");
    const coreApi = await buildAndDeployApi(
      coreApiPath,
      testEnvState.ipfs,
      testEnvState.ensAddress,
    );
    coreEnsUri = `ens/testnet/${coreApi.ensDomain}`;
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
        uri: coreEnsUri,
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
              uri: coreEnsUri,
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

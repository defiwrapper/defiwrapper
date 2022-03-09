import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { GetTokenComponentsResponse, IsValidProtocolTokenResponse, TokenComponent } from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let testEnvState: {
    ethereum: string;
    ensAddress: string;
    ipfs: string;
  };

  beforeAll(async () => {
    testEnvState = await initTestEnvironment();
    // get client
    const clientConfig = getPlugins(
      testEnvState.ethereum,
      testEnvState.ipfs,
      testEnvState.ensAddress,
    );
    client = new Web3ApiClient(clientConfig);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("curve", () => {
    let curveEnsUri: string;
    let tokenEnsUri: string;
    beforeAll(async () => {
      // deploy api
      const curveApiPath: string = path.join(path.resolve(__dirname), "..", "..", "..", "..");
      const curveApi = await buildAndDeployApi(
        curveApiPath,
        testEnvState.ipfs,
        testEnvState.ensAddress,
      );
      curveEnsUri = `ens/testnet/${curveApi.ensDomain}`;

      // deploy token defiwrapper
      const tokenApiPath: string = path.join(curveApiPath, "..", "..", "..", "..", "token");
      const tokenApi = await buildAndDeployApi(
        tokenApiPath,
        testEnvState.ipfs,
        testEnvState.ensAddress,
      );
      tokenEnsUri = `ens/testnet/${tokenApi.ensDomain}`;
    });
    describe("isValidTokenProtocol", () => {
      const isValidProtocolToken = async (
        tokenAddress: string,
        protocolId: string,
      ): Promise<QueryApiResult<IsValidProtocolTokenResponse>> => {
        const response = await client.query<IsValidProtocolTokenResponse>({
          uri: curveEnsUri,
          query: `
            query IsValidProtocolToken($tokenAddress: String, $protocolId: String) {
              isValidProtocolToken(
                tokenAddress: $tokenAddress,
                protocolId: $protocolId
              )
            }
          `,
          variables: {
            tokenAddress: tokenAddress,
            protocolId: protocolId,
          },
          config: {
            envs: [
              {
                uri: curveEnsUri,
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
      test("curve 3pool gauge", async () => {
        const result = await isValidProtocolToken(
          "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A",
          "curve_fi_gauge_v2",
        );

        expect(result.errors).toBeFalsy();
        expect(result.data).toBeTruthy();
        expect(result.data?.isValidProtocolToken).toBe(true);
      });

      test("curve bBTC metapool", async () => {
        const result = await isValidProtocolToken(
          "0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b",
          "curve_fi_pool_v2",
        );

        expect(result.errors).toBeFalsy();
        expect(result.data).toBeTruthy();
        expect(result.data?.isValidProtocolToken).toBe(true);
      });
    });

    describe("getTokenComponents", () => {
      const getTokenComponents = async (
        tokenAddress: string,
        protoclId: string,
      ): Promise<QueryApiResult<GetTokenComponentsResponse>> => {
        const response = await client.query<GetTokenComponentsResponse>({
          uri: curveEnsUri,
          query: `
            query GetTokenComponents($tokenAddress: String!) {
              getTokenComponents(
                tokenAddress: $tokenAddress,
                protocolId: $protocolId,
              )
            }
          `,
          variables: {
            tokenAddress: tokenAddress,
            protocolId: protoclId,
          },
          config: {
            redirects: [
              {
                from: "ens/token.defiwrapper.eth",
                to: tokenEnsUri,
              },
            ],
            envs: [
              {
                uri: curveEnsUri,
                query: {
                  connection: {
                    networkNameOrChainId: "MAINNET",
                  },
                },
              },
              {
                uri: "ens/token.defiwrapper.eth",
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
      test("curve 3pool", async () => {
        const result = await getTokenComponents(
          "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
          "curve_fi_pool_v2",
        );

        expect(result.errors).toBeFalsy();
        expect(result.data).toBeTruthy();
        expect(result.data?.getTokenComponents).toMatchObject({
          rate: "1",
          unresolvedComponents: 0,
          tokenAddress: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
          components: [
            {
              tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              components: [],
              unresolvedComponents: 0,
            },
            {
              tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              components: [],
              unresolvedComponents: 0,
            },
            {
              tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              components: [],
              unresolvedComponents: 0,
            },
          ],
        });
        const tokenComponent = result.data?.getTokenComponents as TokenComponent;
        let sum = 0;
        tokenComponent.components.forEach((x: TokenComponent) => {
          sum += +x.rate;
        });

        expect(sum).toBeGreaterThan(0.95);
        expect(sum).toBeLessThan(1.05);
      });
    });
  });
});

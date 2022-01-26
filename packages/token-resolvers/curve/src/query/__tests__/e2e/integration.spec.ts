import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { IsValidProtocolTokenResponse } from "./types";

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
    beforeAll(async () => {
      // deploy api
      const curveApiPath: string = path.join(path.resolve(__dirname), "..", "..", "..", "..");
      const curveApi = await buildAndDeployApi(
        curveApiPath,
        testEnvState.ipfs,
        testEnvState.ensAddress,
      );
      curveEnsUri = `ens/testnet/${curveApi.ensDomain}`;
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
                    networkNameOrChainId: "1",
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
  });
});

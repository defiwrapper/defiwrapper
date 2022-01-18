import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import {
  GetProtocolResponse,
  IsValidTokenProtocolResponse,
  ResolveProtocolResponse,
  Token,
} from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let ensUri: string;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const config = getPlugins(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient(config);
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "..", "..", "..", "..");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("resolveProtocol", () => {
    const resolveProtocol = async (
      token: Token,
    ): Promise<QueryApiResult<ResolveProtocolResponse>> => {
      const response = await client.query<ResolveProtocolResponse>({
        uri: ensUri,
        query: `
          query ResolveProtocol($token: Token!) {
            resolveProtocol(
              token: $token
            )
          }
        `,
        variables: {
          token: token,
        },
      });
      return response;
    };

    test("sushibar", async () => {
      const result = await resolveProtocol({
        address: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
        name: "SushiBar",
        symbol: "xSUSHI",
        decimals: 18,
        totalSupply: "68828762817907898982295808",
      });

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.resolveProtocol).toMatchObject({
        id: "sushibar_v1",
        organization: "Sushi",
        name: "Sushibar",
        version: "1",
        forkedFrom: null,
      });
    });

    test("sushiswap", async () => {
      const result = await resolveProtocol({
        address: "0x397ff1542f962076d0bfe58ea045ffa2d347aca0",
        name: "SushiSwap LP Token",
        symbol: "SLP",
        decimals: 18,
        totalSupply: "1743044533967859970",
      });

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.resolveProtocol).toMatchObject({
        id: "sushiswap_v1",
        organization: "Sushi",
        name: "Sushiswap",
        version: "1",
        forkedFrom: {
          id: "uniswap_v2",
          organization: "Uniswap",
          name: "Uniswap",
          version: "2",
          forkedFrom: null,
        },
      });
    });

    test("curve 3pool gauge", async () => {
      const result = await resolveProtocol({
        address: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
        name: "Curve.fi DAI/USDC/USDT",
        symbol: "3Crv",
        decimals: 18,
        totalSupply: "1000000000000000000",
      });

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.resolveProtocol).toMatchObject({
        id: "curve_fi_pool_v2",
        organization: "Curve.fi",
        name: "Curve.fi pool",
        version: "2",
        forkedFrom: null,
      });
    });
  });

  describe("isValidTokenProtocol", () => {
    const isValidTokenProtocol = async (
      tokenAddress: string,
      protocolId: string,
    ): Promise<QueryApiResult<IsValidTokenProtocolResponse>> => {
      const response = await client.query<IsValidTokenProtocolResponse>({
        uri: ensUri,
        query: `
          query IsValidTokenProtocol($tokenAddress: string, $protocolId: string) {
            isValidTokenProtocol(
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
              uri: ensUri,
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
      const result = await isValidTokenProtocol(
        "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A",
        "curve_fi_gauge_v2",
      );

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.isValidTokenProtocol).toBe(true);
    });

    test("curve bBTC metapool", async () => {
      const result = await isValidTokenProtocol(
        "0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b",
        "curve_fi_pool_v2",
      );

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.isValidTokenProtocol).toBe(true);
    });
  });

  describe("getProtocol", () => {
    const getProtocol = async (token: Token): Promise<QueryApiResult<GetProtocolResponse>> => {
      const response = await client.query<GetProtocolResponse>({
        uri: ensUri,
        query: `
          query GetProtocol($token: Token!) {
            getProtocol(
              token: $token
            )
          }
        `,
        variables: {
          token: token,
        },
        config: {
          envs: [
            {
              uri: ensUri,
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

    test("curve 3pool", async () => {
      const result = await getProtocol({
        address: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
        name: "Curve.fi DAI/USDC/USDT",
        symbol: "3Crv",
        decimals: 18,
        totalSupply: "1000000000000000000",
      });

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.getProtocol).toMatchObject({
        id: "curve_fi_pool_v2",
        organization: "Curve.fi",
        name: "Curve.fi pool",
        version: "2",
        forkedFrom: null,
      });
    });
  });
});

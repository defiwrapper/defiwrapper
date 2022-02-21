import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { ResolveProtocolResponse, SupportedProtocolsResponse, Token } from "./types";

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

  describe("supportedProtocols", () => {
    const supportedProtocols = async (): Promise<QueryApiResult<SupportedProtocolsResponse>> => {
      const response = await client.query<SupportedProtocolsResponse>({
        uri: ensUri,
        query: `
          query SupportedProtocols {
            supportedProtocols
          }
        `,
      });

      return response;
    };

    test("supported protocols", async () => {
      const result = await supportedProtocols();

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
    });
  });
});

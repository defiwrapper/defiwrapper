import { QueryApiResult, UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { ResolveProtocolResponse, SupportedProtocolsResponse } from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let ensUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    const {
      ethereum: testEnvEthereum,
      ensAddress,
      ipfs,
      registrarAddress,
      resolverAddress,
    } = await initTestEnvironment();
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "..", "..", "..", "..");
    const api = await buildAndDeployApi({
      apiAbsPath: apiPath,
      ipfsProvider: ipfs,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress: registrarAddress,
      ensResolverAddress: resolverAddress,
      ethereumProvider: testEnvEthereum,
    });
    ensUri = `ens/testnet/${api.ensDomain}`;

    // deploy token api
    const tokenApiPath: string = path.join(
      apiPath,
      "..",
      "..",
      "..",
      "token-resolvers",
      "resolvers",
      "ethereum",
    );
    const tokenApi = await buildAndDeployApi({
      apiAbsPath: tokenApiPath,
      ipfsProvider: ipfs,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress: registrarAddress,
      ensResolverAddress: resolverAddress,
      ethereumProvider: testEnvEthereum,
    });
    tokenUri = `ens/testnet/${tokenApi.ensDomain}`;

    // get client
    const config = getPlugins(testEnvEthereum, ipfs, ensAddress);
    config.envs = [
      {
        uri: ensUri,
        query: {
          connection: {
            networkNameOrChainId: "mainnet",
          },
        },
      },
      {
        uri: tokenUri,
        query: {
          connection: {
            networkNameOrChainId: "mainnet",
          },
        },
      },
    ];

    const ethRedirect: UriRedirect<string> = {
      to: tokenUri,
      from: "ens/ethereum.token.resolvers.defiwrapper.eth",
    };
    config.redirects = config.redirects ? [...config.redirects, ethRedirect] : [ethRedirect];

    client = new Web3ApiClient(config);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("resolveProtocol", () => {
    const resolveProtocol = async (
      tokenAddress: string,
    ): Promise<QueryApiResult<ResolveProtocolResponse>> => {
      const response = await client.query<ResolveProtocolResponse>({
        uri: ensUri,
        query: `
          query ResolveProtocol($tokenAddress: String!) {
            resolveProtocol(
              tokenAddress: $tokenAddress
            )
          }
        `,
        variables: {
          tokenAddress: tokenAddress,
        },
      });
      return response;
    };

    test("sushibar", async () => {
      const result = await resolveProtocol("0x8798249c2e607446efb7ad49ec89dd1865ff4272");

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
      const result = await resolveProtocol("0x397ff1542f962076d0bfe58ea045ffa2d347aca0");

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
      const result = await resolveProtocol("0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490");

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

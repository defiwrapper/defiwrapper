import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import {
  GetProtocolResponse,
  IsValidProtocolTokenResponse,
  Protocol,
  ResolveProtocolResponse,
  Token,
} from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let testEnvState: {
    ethereum: string;
    ensAddress: string;
    ipfs: string;
  };
  let coreEnsUri: string;
  let ethResolverEnsUri: string;
  let curveResolverEnsUri: string;

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

    const ethResolverApiPath: string = path.join(
      coreApiPath,
      "..",
      "resolvers",
      "protocol-resolvers",
      "resolvers",
      "ethereum",
    );
    const ethResolverApi = await buildAndDeployApi(
      ethResolverApiPath,
      testEnvState.ipfs,
      testEnvState.ensAddress,
    );
    ethResolverEnsUri = `ens/testnet/${ethResolverApi.ensDomain}`;

    const curveResolverEnsUriPath: string = path.join(
      coreApiPath,
      "..",
      "resolvers",
      "token-resolvers",
      "resolvers",
      "curve",
    );
    const curveResolverApi = await buildAndDeployApi(
      curveResolverEnsUriPath,
      testEnvState.ipfs,
      testEnvState.ensAddress,
    );
    curveResolverEnsUri = `ens/testnet/${curveResolverApi.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("resolveProtocol", () => {
    const resolveProtocol = async (
      token: Token,
    ): Promise<QueryApiResult<ResolveProtocolResponse>> => {
      const newImpl = {
        interface: "w3://ens/interface.protocol-resolvers.defiwrapper.eth",
        implementations: [ethResolverEnsUri],
      };
      const clientConfig = getPlugins(
        testEnvState.ethereum,
        testEnvState.ipfs,
        testEnvState.ensAddress,
      );
      if (clientConfig.interfaces) {
        clientConfig.interfaces.push(newImpl);
      }
      clientConfig.envs = [
        {
          uri: coreEnsUri,
          query: {
            connection: {
              networkNameOrChainId: "MAINNET",
            },
          },
        },
      ];
      const response = await client.query<ResolveProtocolResponse>({
        uri: coreEnsUri,
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
        config: clientConfig,
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

  describe("isValidProtocolToken", () => {
    const isValidProtocolToken = async (
      tokenAddress: string,
      protocol: Protocol,
    ): Promise<QueryApiResult<IsValidProtocolTokenResponse>> => {
      const response = await client.query<IsValidProtocolTokenResponse>({
        uri: coreEnsUri,
        query: `
          query IsValidProtocolToken($tokenAddress: String, $protocol: Protocol) {
            isValidProtocolToken(
              tokenAddress: $tokenAddress,
              protocol: $protocol
            )
          }
        `,
        variables: {
          tokenAddress: tokenAddress,
          protocol: protocol,
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
            {
              uri: curveResolverEnsUri,
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
      const result = await isValidProtocolToken("0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A", {
        id: "curve_fi_gauge_v2",
        organization: "Curve.fi",
        name: "Curve.fi pool",
        adapterUri: curveResolverEnsUri,
        version: "2",
        forkedFrom: null,
      });

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.isValidProtocolToken).toBe(true);
    });

    test("curve bBTC metapool", async () => {
      const result = await isValidProtocolToken("0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b", {
        id: "curve_fi_pool_v2",
        organization: "Curve.fi",
        name: "Curve.fi pool",
        adapterUri: curveResolverEnsUri,
        version: "2",
        forkedFrom: null,
      });

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.isValidProtocolToken).toBe(true);
    });
  });

  describe("getProtocol", () => {
    const getProtocol = async (token: Token): Promise<QueryApiResult<GetProtocolResponse>> => {
      const newImpl = {
        interface: "w3://ens/interface.protocol-resolvers.defiwrapper.eth",
        implementations: [ethResolverEnsUri],
      };
      const clientConfig = getPlugins(
        testEnvState.ethereum,
        testEnvState.ipfs,
        testEnvState.ensAddress,
      );
      if (clientConfig.interfaces) {
        clientConfig.interfaces.push(newImpl);
      } else {
        clientConfig.interfaces = [newImpl];
      }
      clientConfig.envs = [
        {
          uri: coreEnsUri,
          query: {
            connection: {
              networkNameOrChainId: "MAINNET",
            },
          },
        },
        {
          uri: "w3://ens/curve.token-resolvers.defiwrapper.eth",
          query: {
            connection: {
              networkNameOrChainId: "MAINNET",
            },
          },
        },
      ];
      clientConfig.redirects = [
        ...(clientConfig.redirects ? clientConfig.redirects : []),
        {
          from: "w3://ens/curve.token-resolvers.defiwrapper.eth",
          to: curveResolverEnsUri,
        },
      ];
      const response = await client.query<GetProtocolResponse>({
        uri: coreEnsUri,
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
        config: clientConfig,
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

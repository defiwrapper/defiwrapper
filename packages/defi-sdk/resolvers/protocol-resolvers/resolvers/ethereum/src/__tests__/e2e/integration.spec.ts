import { InvokeResult, UriRedirect, PolywrapClient } from "@polywrap/client-js";
import { buildWrapper, initTestEnvironment, stopTestEnvironment, providers, ensAddresses } from "@polywrap/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { ResolveProtocolResponse, SupportedProtocolsResponse } from "./types";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let ensUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    await initTestEnvironment();
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "../../..");
    await buildWrapper(apiPath);
    ensUri = `fs/${apiPath}/build`;

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
    await buildWrapper(tokenApiPath);
    tokenUri = `fs/${tokenApiPath}/build`;

    // get client
    const config = getPlugins(providers.ethereum, providers.ipfs, ensAddresses.ensAddress);
    config.envs = [
      {
        uri: ensUri,
        env: {
          connection: {
            networkNameOrChainId: "mainnet",
          },
        },
      },
      {
        uri: tokenUri,
        env: {
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

    client = new PolywrapClient(config);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("resolveProtocol", () => {
    const resolveProtocol = async (
      tokenAddress: string,
    ): Promise<InvokeResult<ResolveProtocolResponse>> => {
      const response = await client.invoke<ResolveProtocolResponse>({
        uri: ensUri,
        method: `resolveProtocol`,
        args: {
          tokenAddress,
        },
      });
      return response;
    };

    test("sushibar", async () => {
      const result = await resolveProtocol("0x8798249c2e607446efb7ad49ec89dd1865ff4272");

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        id: "sushibar_v1",
        organization: "Sushi",
        name: "Sushibar",
        version: "1",
        forkedFrom: null,
      });
    });

    test("sushiswap", async () => {
      const result = await resolveProtocol("0x397ff1542f962076d0bfe58ea045ffa2d347aca0");

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
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

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        id: "curve_fi_pool_v2",
        organization: "Curve.fi",
        name: "Curve.fi pool",
        version: "2",
        forkedFrom: null,
      });
    });
  });

  describe("supportedProtocols", () => {
    const supportedProtocols = async (): Promise<InvokeResult<SupportedProtocolsResponse>> => {
      const response = await client.invoke<SupportedProtocolsResponse>({
        uri: ensUri,
        method: "supportedProtocols"
      });

      return response;
    };

    test("supported protocols", async () => {
      const result = await supportedProtocols();

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
    });
  });
});

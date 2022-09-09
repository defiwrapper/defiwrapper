import { PolywrapClient, QueryResult } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import path from "path";

import { getClientConfig } from "../utils";
import {
  GetProtocolResponse,
  IsValidProtocolTokenResponse,
  ResolveProtocolResponse,
} from "./types";

jest.setTimeout(800000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let coreEnsUri: string;
  let ethResolverEnsUri: string;
  let curveResolverEnsUri: string;
  let tokenEnsUri: string;

  beforeAll(async () => {
    // deploy api
    const coreWrapperPath: string = path.join(path.resolve(__dirname), "..", "..", "..");
    await buildWrapper(coreWrapperPath);
    coreEnsUri = `fs/${coreWrapperPath}/build`;

    const tokenWrapperPath: string = path.join(
      coreWrapperPath,
      "..",
      "resolvers",
      "token-resolvers",
      "resolvers",
      "ethereum",
    );
    await buildWrapper(tokenWrapperPath);
    tokenEnsUri = `fs/${tokenWrapperPath}/build`;

    const ethResolverWrapperPath: string = path.join(
      coreWrapperPath,
      "..",
      "resolvers",
      "protocol-resolvers",
      "resolvers",
      "ethereum",
    );
    await buildWrapper(ethResolverWrapperPath);
    ethResolverEnsUri = `fs/${ethResolverWrapperPath}/build`;

    const curveResolverEnsUriPath: string = path.join(
      coreWrapperPath,
      "..",
      "resolvers",
      "asset-resolvers",
      "resolvers",
      "curve",
    );
    await buildWrapper(curveResolverEnsUriPath);
    curveResolverEnsUri = `fs/${curveResolverEnsUriPath}/build`;

    // get client
    const config = getClientConfig(tokenEnsUri, ethResolverEnsUri, curveResolverEnsUri);
    client = new PolywrapClient(config);
  });

  describe("resolveProtocol", () => {
    const resolveProtocol = async (
      tokenAddress: string,
    ): Promise<QueryResult<ResolveProtocolResponse>> => {
      const response = await client.query<ResolveProtocolResponse>({
        uri: coreEnsUri,
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

  describe("isValidProtocolToken", () => {
    const isValidProtocolToken = async (
      tokenAddress: string,
      protocolId: string,
      adapterUri: string,
    ): Promise<QueryResult<IsValidProtocolTokenResponse>> => {
      const response = await client.query<IsValidProtocolTokenResponse>({
        uri: coreEnsUri,
        query: `
          query IsValidProtocolToken($tokenAddress: String, $protocolId: String, $adapterUri: String) {
            isValidProtocolToken(
              tokenAddress: $tokenAddress,
              protocolId: $protocolId,
              protocolAdapterUri: $adapterUri
            )
          }
        `,
        variables: {
          tokenAddress: tokenAddress,
          protocolId: protocolId,
          adapterUri: adapterUri,
        },
      });
      return response;
    };

    test("curve 3pool gauge", async () => {
      const result = await isValidProtocolToken(
        "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A",
        "curve_fi_gauge_v2",
        curveResolverEnsUri,
      );
      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.isValidProtocolToken).toBe(true);
    });

    test("curve bBTC metapool", async () => {
      const result = await isValidProtocolToken(
        "0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b",
        "curve_fi_pool_v2",
        curveResolverEnsUri,
      );

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.isValidProtocolToken).toBe(true);
    });

    test("curve 3pool", async () => {
      const result = await isValidProtocolToken(
        "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
        "curve_fi_pool_v2",
        curveResolverEnsUri,
      );

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.isValidProtocolToken).toBe(true);
    });
  });

  describe("getProtocol", () => {
    const getProtocol = async (tokenAddress: string): Promise<QueryResult<GetProtocolResponse>> => {
      const response = await client.query<GetProtocolResponse>({
        uri: coreEnsUri,
        query: `
          query GetProtocol($tokenAddress: String!) {
            getProtocol(
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

    test("curve 3pool", async () => {
      const result = await getProtocol("0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490");

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

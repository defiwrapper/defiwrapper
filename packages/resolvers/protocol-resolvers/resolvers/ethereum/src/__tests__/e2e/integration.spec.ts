import { InvokeResult, PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { ProtocolResolver_Protocol } from "../types/wrap";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let wrapperUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // deploy api
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    wrapperUri = `fs/${wrapperAbsPath}/build`;

    // get client
    const config = getConfig(wrapperUri, tokenResolverUri, "http://localhost:8546");
    client = new PolywrapClient(config);
  });

  describe("resolveProtocol", () => {
    const resolveProtocol = async (
      tokenAddress: string,
    ): Promise<InvokeResult<ProtocolResolver_Protocol | null>> => {
      return await client.invoke<ProtocolResolver_Protocol | null>({
        uri: wrapperUri,
        method: `resolveProtocol`,
        args: {
          tokenAddress,
        },
      });
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
    const supportedProtocols = async (): Promise<InvokeResult<ProtocolResolver_Protocol[]>> => {
      return await client.invoke<ProtocolResolver_Protocol[]>({
        uri: wrapperUri,
        method: "supportedProtocols",
      });
    };

    test("supported protocols", async () => {
      const result = await supportedProtocols();

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
    });
  });
});

import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Curve_Module } from "../types";

jest.setTimeout(300000);

describe("Curve", () => {
  let client: PolywrapClient;
  let curveUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    curveUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(curveUri, tokenResolverUri));
  });

  describe("isValidTokenProtocol", () => {
    test("curve 3pool gauge", async () => {
      const result = await Curve_Module.isValidProtocolToken(
        {
          tokenAddress: "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A".toLowerCase(),
          protocolId: "curve_fi_gauge_v2",
        },
        client,
        curveUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBe(true);
    });

    test("curve bBTC metapool", async () => {
      const result = await Curve_Module.isValidProtocolToken(
        {
          tokenAddress: "0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b".toLowerCase(),
          protocolId: "curve_fi_pool_v2",
        },
        client,
        curveUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBe(true);
    });
  });

  describe("getTokenComponents", () => {
    test("curve 3pool", async () => {
      const result = await Curve_Module.getTokenComponents(
        {
          tokenAddress: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490".toLowerCase(),
          protocolId: "curve_fi_pool_v2",
        },
        client,
        curveUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490".toLowerCase(),
        components: [
          {
            tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase(),
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase(),
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7".toLowerCase(),
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.value;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });

      expect(sum).toBeGreaterThan(0.95);
      expect(sum).toBeLessThan(1.05);
    });
  });
});

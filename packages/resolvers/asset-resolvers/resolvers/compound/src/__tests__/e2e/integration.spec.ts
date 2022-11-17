import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Compound_Module } from "../types";

jest.setTimeout(300000);

describe("Compound Token Resolver", () => {
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599".toLowerCase();
  const ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee".toLowerCase();
  const v1_cWBTC = "0xc11b1268c1a384e55c48c2391d8d480264a3a7f4".toLowerCase();
  const v1_cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5".toLowerCase();

  let client: PolywrapClient;
  let compoundUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    compoundUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(compoundUri, tokenResolverUri));
  });

  describe("isValidProtocolToken", () => {
    test("compound_v1 cWBTC", async () => {
      const result = await Compound_Module.isValidProtocolToken(
        {
          tokenAddress: v1_cWBTC,
          protocolId: "compound_v1",
        },
        client,
        compoundUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(true);
    });

    test("compound_v1 invalid protocol token", async () => {
      const result = await Compound_Module.isValidProtocolToken(
        {
          tokenAddress: WBTC,
          protocolId: "compound_v1",
        },
        client,
        compoundUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("compound_v1 cWBTC", async () => {
      const result = await Compound_Module.getTokenComponents(
        {
          tokenAddress: v1_cWBTC,
          protocolId: "compound_v1",
        },
        client,
        compoundUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_cWBTC,
        components: [
          {
            tokenAddress: WBTC,
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
      expect(sum).toBeGreaterThan(0.015);
      expect(sum).toBeLessThan(0.025);
    });

    test("compound_v1 cETH", async () => {
      const result = await Compound_Module.getTokenComponents(
        {
          tokenAddress: v1_cETH,
          protocolId: "compound_v1",
        },
        client,
        compoundUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_cETH,
        components: [
          {
            tokenAddress: ETH,
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
      expect(sum).toBeGreaterThan(0.015);
      expect(sum).toBeLessThan(0.025);
    });
  });
});

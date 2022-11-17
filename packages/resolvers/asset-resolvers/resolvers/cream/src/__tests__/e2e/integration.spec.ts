import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Cream_Module } from "../types";

jest.setTimeout(300000);

describe("Cream Token Resolver", () => {
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599".toLowerCase();
  const ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee".toLowerCase();
  const v1_crWBTC = "0x197070723CE0D3810a0E47F06E935c30a480D4Fc".toLowerCase();
  const v1_crETH = "0xD06527D5e56A3495252A528C4987003b712860eE".toLowerCase();
  const v2_cyWBTC = "0x8Fc8BFD80d6A9F17Fb98A373023d72531792B431".toLowerCase();

  let client: PolywrapClient;
  let creamUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    creamUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(creamUri, tokenResolverUri));
  });

  describe("isValidProtocolToken", () => {
    test("cream_v1 crWBTC", async () => {
      const result = await Cream_Module.isValidProtocolToken(
        {
          tokenAddress: v1_crWBTC,
          protocolId: "cream_v1",
        },
        client,
        creamUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(true);
    });

    test("cream_v2 cyWBTC", async () => {
      const result = await Cream_Module.isValidProtocolToken(
        {
          tokenAddress: v2_cyWBTC,
          protocolId: "cream_v2",
        },
        client,
        creamUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(true);
    });

    test("cream_v1 invalid protocol token", async () => {
      const result = await Cream_Module.isValidProtocolToken(
        {
          tokenAddress: v2_cyWBTC,
          protocolId: "cream_v1",
        },
        client,
        creamUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(false);
    });

    test("cream_v2 invalid protocol token", async () => {
      const result = await Cream_Module.isValidProtocolToken(
        {
          tokenAddress: v1_crWBTC,
          protocolId: "cream_v2",
        },
        client,
        creamUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("cream_v1 crWBTC", async () => {
      const result = await Cream_Module.getTokenComponents(
        {
          tokenAddress: v1_crWBTC,
          protocolId: "v1_crWBTC",
        },
        client,
        creamUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_crWBTC,
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

    test("cream_v1 crETH", async () => {
      const result = await Cream_Module.getTokenComponents(
        {
          tokenAddress: v1_crETH,
          protocolId: "cream_v1",
        },
        client,
        creamUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_crETH,
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

    test("cream_v2 cyWBTC", async () => {
      const result = await Cream_Module.getTokenComponents(
        {
          tokenAddress: v2_cyWBTC,
          protocolId: "cream_v2",
        },
        client,
        creamUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_cyWBTC,
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
      expect(sum).toBeGreaterThan(0);
      expect(sum).toBeLessThan(0.03);
    });
  });
});

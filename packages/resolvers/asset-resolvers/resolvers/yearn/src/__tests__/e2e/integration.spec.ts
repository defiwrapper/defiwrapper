import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Yearn_Interface_TokenComponent, Yearn_Module } from "../types";

jest.setTimeout(300000);

describe("Yearn Token Resolver", () => {
  const v2_yvWBTC = "0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E";
  const v1_y3Crv = "0x9cA85572E6A3EbF24dEDd195623F188735A5179f";

  let client: PolywrapClient;
  let yearnUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    yearnUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(yearnUri, tokenResolverUri));
  });

  describe("isValidProtocolToken", () => {
    test("yearn_vault_v2 yvWBTC", async () => {
      const result = await Yearn_Module.isValidProtocolToken(
        {
          tokenAddress: v2_yvWBTC,
          protocolId: "yearn_vault_v2",
        },
        client,
        yearnUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("yearn_vault_v1 yCrv3", async () => {
      const result = await Yearn_Module.isValidProtocolToken(
        {
          tokenAddress: v1_y3Crv,
          protocolId: "yearn_vault_v1",
        },
        client,
        yearnUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("yearn_vault_v2 invalid protocol token", async () => {
      const result = await Yearn_Module.isValidProtocolToken(
        {
          tokenAddress: "0x1",
          protocolId: "yearn_vault_v2",
        },
        client,
        yearnUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("yearn_vault_v1 invalid protocol token", async () => {
      const result = await Yearn_Module.isValidProtocolToken(
        {
          tokenAddress: "0x1",
          protocolId: "yearn_vault_v1",
        },
        client,
        yearnUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("yearn_vault_v2 yvWBTC", async () => {
      const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

      const result = await Yearn_Module.getTokenComponents(
        {
          tokenAddress: v2_yvWBTC,
          protocolId: "yearn_vault_v2",
        },
        client,
        yearnUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_yvWBTC,
        components: [
          {
            tokenAddress: WBTC,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Yearn_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThanOrEqual(1);
      expect(sum).toBeLessThan(100);
    });

    test("yearn_vault_v1 yCrv3", async () => {
      const _3Crv = "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490";

      const result = await Yearn_Module.getTokenComponents(
        {
          tokenAddress: v1_y3Crv,
          protocolId: "yearn_vault_v1",
        },
        client,
        yearnUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_y3Crv,
        components: [
          {
            tokenAddress: _3Crv,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Yearn_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThanOrEqual(1);
      expect(sum).toBeLessThan(100);
    });
  });
});

import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { OneInch_Interface_TokenComponent, OneInch_Module } from "../types";

jest.setTimeout(300000);

describe("1Inch Token Resolver", () => {
  const USDC_DAI_V2 = "0x05D7BC2a5eC390743edEc5AA9F9Fe35aa87Efa43".toLowerCase();
  const ETH_WBTC_V2 = "0x6a11F3E5a01D129e566d783A7b6E8862bFD66CcA".toLowerCase();
  const ETH_WBTC_V1 = "0x322A1E2e18Fffc8d19948581897b2c49b3455240".toLowerCase();
  const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase();
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599".toLowerCase();
  const CHI = "0x0000000000004946c0e9F43F4Dee607b0eF1fA1c".toLowerCase();

  let client: PolywrapClient;
  let oneInchUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // deploy api
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    oneInchUri = `fs/${wrapperAbsPath}/build`;

    // get client
    const config = getConfig(oneInchUri, tokenResolverUri);
    client = new PolywrapClient(config);
  });

  describe("isValidTokenProtocol", () => {
    test("1inch_v2 USDC-DAI pool", async () => {
      const result = await OneInch_Module.isValidProtocolToken(
        {
          tokenAddress: USDC_DAI_V2,
          protocolId: "1inch_v2",
        },
        client,
        oneInchUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("1inch_v2 ETH_WBTC pool", async () => {
      const result = await OneInch_Module.isValidProtocolToken(
        {
          tokenAddress: ETH_WBTC_V2,
          protocolId: "1inch_v2",
        },
        client,
        oneInchUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("1inch_v1 ETH_WBTC pool", async () => {
      const result = await OneInch_Module.isValidProtocolToken(
        {
          tokenAddress: ETH_WBTC_V1,
          protocolId: "1inch_v1",
        },
        client,
        oneInchUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("1inch_chi CHI", async () => {
      const result = await OneInch_Module.isValidProtocolToken(
        {
          tokenAddress: CHI,
          protocolId: "1inch_chi",
        },
        client,
        oneInchUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token v2", async () => {
      const result = await OneInch_Module.isValidProtocolToken(
        {
          tokenAddress: ETH_WBTC_V1,
          protocolId: "1inch_v2",
        },
        client,
        oneInchUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("invalid protocol token v1", async () => {
      const result = await OneInch_Module.isValidProtocolToken(
        {
          tokenAddress: ETH_WBTC_V2,
          protocolId: "1inch_v1",
        },
        client,
        oneInchUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("invalid protocol token chi", async () => {
      const result = await OneInch_Module.isValidProtocolToken(
        {
          tokenAddress: ETH_WBTC_V2,
          protocolId: "1inch_chi",
        },
        client,
        oneInchUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("1inch_v2 USDC-DAI pool", async () => {
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase();
      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase();

      const result = await OneInch_Module.getTokenComponents(
        {
          tokenAddress: USDC_DAI_V2,
          protocolId: "1inch_v2",
        },
        client,
        oneInchUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: USDC_DAI_V2,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: USDC,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as OneInch_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });

    test("1inch_v2 ETH-WBTC pool", async () => {
      const result = await OneInch_Module.getTokenComponents(
        {
          tokenAddress: ETH_WBTC_V2,
          protocolId: "1inch_v2",
        },
        client,
        oneInchUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: ETH_WBTC_V2,
        components: [
          {
            tokenAddress: ETH,
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: WBTC,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as OneInch_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });

    test("1inch_v1 ETH-WBTC pool", async () => {
      const result = await OneInch_Module.getTokenComponents(
        {
          tokenAddress: ETH_WBTC_V1,
          protocolId: "1inch_v1",
        },
        client,
        oneInchUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: ETH_WBTC_V1,
        components: [
          {
            tokenAddress: ETH,
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: WBTC,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as OneInch_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: OneInch_Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });

    test("1inch_chi CHI", async () => {
      const result = await OneInch_Module.getTokenComponents(
        {
          tokenAddress: CHI,
          protocolId: "1inch_chi",
        },
        client,
        oneInchUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: CHI,
        components: [
          {
            tokenAddress: ETH,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as OneInch_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });
  });
});

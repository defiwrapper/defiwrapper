import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Uniswap_Interface_TokenComponent, Uniswap_Module } from "../types";

jest.setTimeout(300000);

describe("Uniswap Token Resolver", () => {
  const USDC_DAI_POOL = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5".toLowerCase();

  let client: PolywrapClient;
  let uniswapUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    uniswapUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(uniswapUri, tokenResolverUri));
  });

  describe("isValidTokenProtocol", () => {
    test("uniswap_v2 USDC-DAI pool", async () => {
      const result = await Uniswap_Module.isValidProtocolToken(
        {
          tokenAddress: USDC_DAI_POOL,
          protocolId: "uniswap_v2",
        },
        client,
        uniswapUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await Uniswap_Module.isValidProtocolToken(
        {
          tokenAddress: "0x1",
          protocolId: "uniswap_v2",
        },
        client,
        uniswapUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("uniswap_v2 USDC-DAI pool", async () => {
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase();
      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase();

      const result = await Uniswap_Module.getTokenComponents(
        {
          tokenAddress: USDC_DAI_POOL,
          protocolId: "uniswap_v2",
        },
        client,
        uniswapUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: USDC_DAI_POOL,
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
      const tokenComponent = result.data as Uniswap_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });
  });
});

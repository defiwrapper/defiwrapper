import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Sushi_Interface_TokenComponent, Sushi_Module } from "../types";

jest.setTimeout(300000);

describe("Sushi Token Resolver", () => {
  const USDC_WETH_POOL = "0x397ff1542f962076d0bfe58ea045ffa2d347aca0".toLowerCase();
  const XSUSHI_ADDRESS = "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272".toLowerCase();

  let client: PolywrapClient;
  let sushiUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    sushiUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(sushiUri, tokenResolverUri));
  });

  describe("isValidTokenProtocol", () => {
    test("sushiswap_v1 USDC-WETH pool", async () => {
      const result = await Sushi_Module.isValidProtocolToken(
        {
          tokenAddress: USDC_WETH_POOL,
          protocolId: "sushiswap_v1",
        },
        client,
        sushiUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("sushibar_v1", async () => {
      const result = await Sushi_Module.isValidProtocolToken(
        {
          tokenAddress: XSUSHI_ADDRESS,
          protocolId: "sushibar_v1",
        },
        client,
        sushiUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await Sushi_Module.isValidProtocolToken(
        {
          tokenAddress: XSUSHI_ADDRESS,
          protocolId: "sushiswap_v1",
        },
        client,
        sushiUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("invalid protocol token", async () => {
      const result = await Sushi_Module.isValidProtocolToken(
        {
          tokenAddress: USDC_WETH_POOL,
          protocolId: "sushibar_v1",
        },
        client,
        sushiUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("sushiswap_v1 USDC-WETH pool", async () => {
      const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase();
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase();

      const result = await Sushi_Module.getTokenComponents(
        {
          tokenAddress: USDC_WETH_POOL,
          protocolId: "sushiswap_v1",
        },
        client,
        sushiUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: USDC_WETH_POOL,
        components: [
          {
            tokenAddress: USDC,
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: WETH,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Sushi_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });

    test("sushibar_v1", async () => {
      const SUSHI_ADDRESS = "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2".toLowerCase();

      const result = await Sushi_Module.getTokenComponents(
        {
          tokenAddress: XSUSHI_ADDRESS,
          protocolId: "sushibar_v1",
        },
        client,
        sushiUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: XSUSHI_ADDRESS,
        components: [
          {
            tokenAddress: SUSHI_ADDRESS,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Sushi_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });
  });
});

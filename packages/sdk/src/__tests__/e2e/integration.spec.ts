import { PolywrapClient } from "@polywrap/client-js";
import path from "path";

import { SDK_Interface_PriceResolver_TokenBalance, SDK_Module } from "../types";
import { buildWrapper, getClientConfig } from "../utils";

jest.setTimeout(800000);

describe("SDK", () => {
  let client: PolywrapClient;
  let sdkUri: string;
  let covalentAccountResolverUri: string;
  let ethProtocolResolverUri: string;
  let curveAssetResolverUri: string;
  let sushibarAssetResolverUri: string;
  let cgPriceResolverUri: string;
  let ethTokenResolverUri: string;
  let yearnAssetResolverUri: string;

  beforeAll(async () => {
    // deploy api
    const sdkWrapperPath: string = path.join(path.resolve(__dirname), "..", "..", "..");
    await buildWrapper(sdkWrapperPath);
    sdkUri = `fs/${sdkWrapperPath}/build`;

    const tokenWrapperPath: string = path.join(
      sdkWrapperPath,
      "..",
      "resolvers",
      "token-resolvers",
      "resolvers",
      "ethereum",
    );
    await buildWrapper(tokenWrapperPath);
    ethTokenResolverUri = `fs/${tokenWrapperPath}/build`;

    const ethResolverWrapperPath: string = path.join(
      sdkWrapperPath,
      "..",
      "resolvers",
      "protocol-resolvers",
      "resolvers",
      "ethereum",
    );
    await buildWrapper(ethResolverWrapperPath);
    ethProtocolResolverUri = `fs/${ethResolverWrapperPath}/build`;

    const covalentAccountResolverEnsUriPath: string = path.join(
      sdkWrapperPath,
      "..",
      "resolvers",
      "account-resolvers",
      "resolvers",
      "covalent",
    );
    await buildWrapper(covalentAccountResolverEnsUriPath);
    covalentAccountResolverUri = `fs/${covalentAccountResolverEnsUriPath}/build`;

    const curveResolverEnsUriPath: string = path.join(
      sdkWrapperPath,
      "..",
      "resolvers",
      "asset-resolvers",
      "resolvers",
      "curve",
    );
    await buildWrapper(curveResolverEnsUriPath);
    curveAssetResolverUri = `fs/${curveResolverEnsUriPath}/build`;

    const yearnResolverEnsUriPath: string = path.join(
      sdkWrapperPath,
      "..",
      "resolvers",
      "asset-resolvers",
      "resolvers",
      "aave",
    );
    await buildWrapper(yearnResolverEnsUriPath);
    yearnAssetResolverUri = `fs/${yearnResolverEnsUriPath}/build`;

    const sushibarResolverEnsUriPath: string = path.join(
      sdkWrapperPath,
      "..",
      "resolvers",
      "asset-resolvers",
      "resolvers",
      "sushi",
    );
    await buildWrapper(sushibarResolverEnsUriPath);
    sushibarAssetResolverUri = `fs/${sushibarResolverEnsUriPath}/build`;

    const cgPriceResolverPath: string = path.join(
      sdkWrapperPath,
      "..",
      "resolvers",
      "price-resolvers",
      "resolvers",
      "coingecko",
    );
    await buildWrapper(cgPriceResolverPath);
    cgPriceResolverUri = `fs/${cgPriceResolverPath}/build`;

    // get client
    const config = getClientConfig(
      ethTokenResolverUri,
      ethProtocolResolverUri,
      curveAssetResolverUri,
      yearnAssetResolverUri,
      sushibarAssetResolverUri,
      cgPriceResolverUri,
      covalentAccountResolverUri,
    );
    client = new PolywrapClient(config);
  });

  describe("resolveProtocol", () => {
    test("sushibar", async () => {
      const result = await SDK_Module.resolveProtocol(
        { tokenAddress: "0x8798249c2e607446efb7ad49ec89dd1865ff4272" },
        client,
        sdkUri,
      );
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
      const result = await SDK_Module.resolveProtocol(
        { tokenAddress: "0x397ff1542f962076d0bfe58ea045ffa2d347aca0" },
        client,
        sdkUri,
      );

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
      const result = await SDK_Module.resolveProtocol(
        { tokenAddress: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490" },
        client,
        sdkUri,
      );

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

  describe("isValidProtocolToken", () => {
    test("curve 3pool gauge", async () => {
      const result = await SDK_Module.isValidProtocolToken(
        {
          tokenAddress: "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A",
          protocolId: "curve_fi_gauge_v2",
          protocolAdapterUri: curveAssetResolverUri,
        },
        client,
        sdkUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toBe(true);
    });

    test("curve bBTC metapool", async () => {
      const result = await SDK_Module.isValidProtocolToken(
        {
          tokenAddress: "0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b",
          protocolId: "curve_fi_pool_v2",
          protocolAdapterUri: curveAssetResolverUri,
        },
        client,
        sdkUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toBe(true);
    });

    test("curve 3pool", async () => {
      const result = await SDK_Module.isValidProtocolToken(
        {
          tokenAddress: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
          protocolId: "curve_fi_pool_v2",
          protocolAdapterUri: curveAssetResolverUri,
        },
        client,
        sdkUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toBe(true);
    });
  });

  describe("getProtocol", () => {
    test("sushibar", async () => {
      const result = await SDK_Module.getProtocol(
        { tokenAddress: "0x8798249c2e607446efb7ad49ec89dd1865ff4272" },
        client,
        sdkUri,
      );
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
    test("curve 3pool", async () => {
      const result = await SDK_Module.getProtocol(
        { tokenAddress: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490" },
        client,
        sdkUri,
      );

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

  describe("getTokenPrice", () => {
    test("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", async () => {
      const result = await SDK_Module.getTokenPrice(
        {
          tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          balance: "1",
          vsCurrencies: ["usd"],
        },
        client,
        sdkUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      const tokenPrice = result.data as SDK_Interface_PriceResolver_TokenBalance;
      expect(tokenPrice.token).toMatchObject({
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
      });
      expect(tokenPrice.balance).toBe("1");
      expect(+tokenPrice.values[0].price).toBeGreaterThan(0);
      expect(tokenPrice.values[0].currency).toBe("usd");
      expect(tokenPrice.values[0].value).toBe(tokenPrice.values[0].price);
    });
  });

  describe("getTokenComponents", () => {
    test("sushibar: 0x8798249c2e607446efb7ad49ec89dd1865ff4272", async () => {
      const result = await SDK_Module.getTokenComponents(
        {
          tokenAddress: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
        },
        client,
        sdkUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.tokenComponentBalance.token.token).toMatchObject({
        address: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
        name: "SushiBar",
        symbol: "xSUSHI",
        decimals: 18,
      });
      expect(result.data?.tokenComponentBalance.token.balance).toBe("1");

      expect(result.data?.tokenComponentBalance.unresolvedComponents).toBe(0);
      expect(result.data?.tokenComponentBalance.components).toHaveLength(1);
      expect(result.data?.tokenComponentBalance.components[0].token.token).toMatchObject({
        address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2".toLowerCase(),
        name: "SushiToken",
        symbol: "SUSHI",
        decimals: 18,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(+result.data?.tokenComponentBalance.components[0].token.balance).toBeGreaterThan(1);
    });

    test("curve: 0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490", async () => {
      const result = await SDK_Module.getTokenComponents(
        {
          tokenAddress: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
        },
        client,
        sdkUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.tokenComponentBalance.token.token).toMatchObject({
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490".toLowerCase(),
        name: "Curve.fi DAI/USDC/USDT",
        symbol: "3Crv",
        decimals: 18,
      });
      expect(result.data?.tokenComponentBalance.token.balance).toBe("1");

      expect(result.data?.tokenComponentBalance.unresolvedComponents).toBe(0);
      expect(result.data?.tokenComponentBalance.components).toHaveLength(3);
    });
  });

  describe("getTokenBalances", () => {
    test("0x9bA00D6856a4eDF4665BcA2C2309936572473B7E", async () => {
      const result = await SDK_Module.getTokenBalances(
        {
          accountAddress: "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E",
        },
        client,
        sdkUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      const tokenBalances = result.data?.tokenBalances;
      const usdcBalance =
        tokenBalances &&
        tokenBalances.find((x) => x.token.address === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
      expect(usdcBalance).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(+usdcBalance.balance).toBeGreaterThan(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(+usdcBalance.quote).toBeGreaterThan(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(+usdcBalance.quoteRate).toBeGreaterThan(0);
    });

    test("0x18C8224262dEF398d3E4cBB0851Aa7A0211690A8", async () => {
      const result = await SDK_Module.getTokenBalances(
        {
          accountAddress: "0x18C8224262dEF398d3E4cBB0851Aa7A0211690A8",
        },
        client,
        sdkUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.account.toLowerCase()).toBe(
        "0x18C8224262dEF398d3E4cBB0851Aa7A0211690A8".toLowerCase(),
      );
      expect(result.data?.tokenBalances.length).toBeGreaterThan(1);
    });
  });

  describe("getAccountBalance", () => {
    test("0x18C8224262dEF398d3E4cBB0851Aa7A0211690A8", async () => {
      const result = await SDK_Module.getAccountBalance(
        {
          accountAddress: "0x18C8224262dEF398d3E4cBB0851Aa7A0211690A8",
        },
        client,
        sdkUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data?.account.toLowerCase()).toBe(
        "0x18C8224262dEF398d3E4cBB0851Aa7A0211690A8".toLowerCase(),
      );
    });
  });
});

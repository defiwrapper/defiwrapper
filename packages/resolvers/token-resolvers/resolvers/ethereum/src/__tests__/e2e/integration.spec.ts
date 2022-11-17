import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPath } from "../../../config/util";
import { ETR_Module } from "../types/wrap";
jest.setTimeout(300000);

describe("Ethereum Token Resolver", () => {
  let client: PolywrapClient;
  let wrapperUri: string;

  beforeAll(async () => {
    // deploy wrapper
    const wrapperPath: string = getWrapperPath();
    await buildWrapper(wrapperPath);
    wrapperUri = `fs/${wrapperPath}/build`;
    // get client
    const clientConfig = getConfig(wrapperUri);
    client = new PolywrapClient(clientConfig);
  });

  describe("getToken", () => {
    test("USDC", async () => {
      const result = await ETR_Module.getToken(
        { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", type: "ERC20" },
        client,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase(),
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
      });
    });

    test("DAI", async () => {
      const result = await ETR_Module.getToken(
        { address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359", type: "ERC20" },
        client,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359".toLowerCase(),
        name: "Dai Stablecoin v1.0",
        symbol: "DAI",
        decimals: 18,
      });
    });

    test("ETH", async () => {
      const result = await ETR_Module.getToken(
        { address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", type: "ERC20" },
        client,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      });
    });

    test("xSUSHI", async () => {
      const result = await ETR_Module.getToken(
        { address: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272", type: "ERC20" },
        client,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        address: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272".toLowerCase(),
        name: "SushiBar",
        symbol: "xSUSHI",
        decimals: 18,
      });
    });

    test("SAND", async () => {
      const result = await ETR_Module.getToken(
        { address: "0x3845badade8e6dff049820680d1f14bd3903a5d0", type: "ERC20" },
        client,
        wrapperUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        address: "0x3845badade8e6dff049820680d1f14bd3903a5d0".toLowerCase(),
        name: "SAND",
        symbol: "SAND",
        decimals: 18,
      });
    });
  });
});

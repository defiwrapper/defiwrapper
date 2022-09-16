import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPath } from "../../../config/util";
import { ETR_Module } from "../types";
// import { initInfra, stopInfra } from "../utils";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let wrapperUri: string;

  beforeAll(async () => {
    // await initInfra();

    // deploy wrapper
    console.log("build wrapper");
    const wrapperPath: string = getWrapperPath();
    await buildWrapper(wrapperPath);
    wrapperUri = `fs/${wrapperPath}/build`;
    console.log("client config");

    // get client
    const clientConfig = getConfig(
      wrapperUri,
      "https://mainnet.infura.io/v3/07917a2e0ead421a88e8f0fb4059310c",
    );
    client = new PolywrapClient(clientConfig);
  });

  afterAll(async () => {
    // await stopInfra();
  });

  describe("getToken", () => {
    test("USDC", async () => {
      const response = await ETR_Module.getToken(
        { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", type: "ERC20" },
        client,
      );
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
      });
    });

    test("DAI", async () => {
      const response = await ETR_Module.getToken(
        { address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359", type: "ERC20" },
        client,
      );
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
        name: "Dai Stablecoin v1.0",
        symbol: "DAI",
        decimals: 18,
      });
    });

    test("ETH", async () => {
      const response = await ETR_Module.getToken(
        { address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", type: "ERC20" },
        client,
      );
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      });
    });

    test("xSUSHI", async () => {
      const response = await ETR_Module.getToken(
        { address: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272", type: "ERC20" },
        client,
      );
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272",
        name: "SushiBar",
        symbol: "xSUSHI",
        decimals: 18,
      });
    });

    test("SAND", async () => {
      console.log("getToken");
      const response = await ETR_Module.getToken(
        { address: "0x3845badade8e6dff049820680d1f14bd3903a5d0", type: "ERC20" },
        client,
        wrapperUri,
      );
      console.log(JSON.stringify(response, null, 2));
      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        address: "0x3845badade8e6dff049820680d1f14bd3903a5d0",
        name: "SushiBar",
        symbol: "xSUSHI",
        decimals: 18,
      });
    });
  });
});

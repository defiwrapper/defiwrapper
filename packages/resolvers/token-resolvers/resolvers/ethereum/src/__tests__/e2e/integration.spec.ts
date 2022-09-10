import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPath } from "../../../config/util";
import { ETR_Module } from "../types";
import { initInfra, stopInfra } from "../utils";

jest.setTimeout(300000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let wrapperUri: string;

  beforeAll(async () => {
    await initInfra();

    // deploy wrapper
    const wrapperPath: string = getWrapperPath();
    await buildWrapper(wrapperPath);
    wrapperUri = `fs/${wrapperPath}/build`;

    // get client
    const clientConfig = getConfig(wrapperUri, "http://localhost:8546");
    client = new PolywrapClient(clientConfig);
  });

  afterAll(async () => {
    await stopInfra();
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
  });
});

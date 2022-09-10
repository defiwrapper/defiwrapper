import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import path from "path";

import { Interface_TokenComponent } from "../../wrap";
import { getConfig } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";

jest.setTimeout(300000);

describe("Uniswap Token Resolver", () => {
  const USDC_DAI_POOL = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5";

  let client: PolywrapClient;
  let protocolUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const apiPath: string = path.join(path.resolve(__dirname), "../../../");
    await buildWrapper(apiPath);
    protocolUri = `wrap://fs/${apiPath}/build`;

    // build token wrapper
    const tokenApiPath: string = path.join(
      apiPath,
      "..",
      "..",
      "..",
      "token-resolvers",
      "resolvers",
      "ethereum",
    );
    await buildWrapper(tokenApiPath);
    tokenUri = `wrap://fs/${tokenApiPath}/build`;

    client = new PolywrapClient(getConfig(protocolUri));
  });

  describe("isValidTokenProtocol", () => {
    test("uniswap_v2 USDC-DAI pool", async () => {
      const result = await isValidProtocolToken(USDC_DAI_POOL, "uniswap_v2", protocolUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await isValidProtocolToken("0x1", "uniswap_v2", protocolUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("uniswap_v2 USDC-DAI pool", async () => {
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

      const result = await getTokenComponents(
        USDC_DAI_POOL,
        "uniswap_v2",
        tokenUri,
        protocolUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });
  });
});
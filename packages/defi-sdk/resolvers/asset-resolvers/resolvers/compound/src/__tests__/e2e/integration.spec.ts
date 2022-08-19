import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import path from "path";

import { Interface_TokenComponent as TokenComponent } from "../../wrap";
import { getConfig } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";

jest.setTimeout(300000);

describe("Compound Token Resolver", () => {
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  const v1_cWBTC = "0xc11b1268c1a384e55c48c2391d8d480264a3a7f4";
  const v1_cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";

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

  describe("isValidProtocolToken", () => {
    test("compound_v1 cWBTC", async () => {
      const result = await isValidProtocolToken(v1_cWBTC, "compound_v1", protocolUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("compound_v1 invalid protocol token", async () => {
      const result = await isValidProtocolToken(WBTC, "compound_v1", protocolUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("compound_v1 cWBTC", async () => {
      const result = await getTokenComponents(
        v1_cWBTC,
        "compound_v1",
        tokenUri,
        protocolUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_cWBTC,
        components: [
          {
            tokenAddress: WBTC,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0.015);
      expect(sum).toBeLessThan(0.025);
    });

    test("compound_v1 cETH", async () => {
      const result = await getTokenComponents(
        v1_cETH,
        "compound_v1",
        tokenUri,
        protocolUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_cETH,
        components: [
          {
            tokenAddress: ETH,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0.015);
      expect(sum).toBeLessThan(0.025);
    });
  });
});

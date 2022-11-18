import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Linkswap_Module } from "../types";

jest.setTimeout(300000);

describe("Linkswap Token Resolver", () => {
  const LINK_DOKI_POOL = "0xbe755C548D585dbc4e3Fe4bcD712a32Fd81e5Ba0".toLowerCase();

  let client: PolywrapClient;
  let linkswapUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    linkswapUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(linkswapUri, tokenResolverUri));
  });

  describe("isValidTokenProtocol", () => {
    test("linkswap_v1 USDC-DAI pool", async () => {
      const result = await Linkswap_Module.isValidProtocolToken(
        {
          tokenAddress: LINK_DOKI_POOL,
          protocolId: "linkswap_v1",
        },
        client,
        linkswapUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await Linkswap_Module.isValidProtocolToken(
        {
          tokenAddress: "0x1",
          protocolId: "linkswap_v1",
        },
        client,
        linkswapUri,
      );
      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).not.toBeUndefined();
      expect(result.value).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("linkswap_v1 USDC-DAI pool", async () => {
      const LINK = "0x514910771AF9Ca656af840dff83E8264EcF986CA".toLowerCase();
      const DOKI = "0x9cEB84f92A0561fa3Cc4132aB9c0b76A59787544".toLowerCase();

      const result = await Linkswap_Module.getTokenComponents(
        {
          tokenAddress: LINK_DOKI_POOL,
          protocolId: "linkswap_v1",
        },
        client,
        linkswapUri,
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: LINK_DOKI_POOL,
        components: [
          {
            tokenAddress: LINK,
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: DOKI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.value;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });
  });
});

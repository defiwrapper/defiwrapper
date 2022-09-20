import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import { Aave_Interface_TokenComponent, Aave_Module } from "../types";

jest.setTimeout(300000);

describe("Aave Token Resolver", () => {
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase();
  const v2_aDai = "0x028171bCA77440897B824Ca71D1c56caC55b68A3".toLowerCase();
  const v2_sDai = "0x778A13D3eeb110A4f7bb6529F99c000119a08E92".toLowerCase();
  const v2_vDai = "0x6C3c78838c761c6Ac7bE9F59fe808ea2A6E4379d".toLowerCase();
  const v2_amm_aDai = "0x79bE75FFC64DD58e66787E4Eae470c8a1FD08ba4".toLowerCase();
  const v2_amm_sDai = "0x8da51a5a3129343468a63A96ccae1ff1352a3dfE".toLowerCase();
  const v2_amm_vDai = "0x3F4fA4937E72991367DC32687BC3278f095E7EAa".toLowerCase();
  const v1_aDai = "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d".toLowerCase();
  const v1_aUniDai = "0x048930eec73c91B44b0844aEACdEBADC2F2b6efb".toLowerCase();

  let client: PolywrapClient;
  let aaveUri: string;
  let tokenResolverUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenResolverUri = `fs/${tokenResolverAbsPath}/build`;
    aaveUri = `fs/${wrapperAbsPath}/build`;

    client = new PolywrapClient(getConfig(aaveUri, tokenResolverUri));
  });

  describe("isValidProtocolToken", () => {
    test("aave_lending_v2 aDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_aDai,
          protocolId: "aave_lending_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_stable_debt_v2 sDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_sDai,
          protocolId: "aave_stable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_variable_debt_v2 vDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_vDai,
          protocolId: "aave_variable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_amm_lending_v2 aDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_amm_aDai,
          protocolId: "aave_amm_lending_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_amm_stable_debt_v2 sDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_amm_sDai,
          protocolId: "aave_amm_stable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_amm_variable_debt_v2 vDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_amm_vDai,
          protocolId: "aave_amm_variable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_lending_v1 aDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v1_aDai,
          protocolId: "aave_lending_v1",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_uniswap_v1 aUniDai", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v1_aUniDai,
          protocolId: "aave_uniswap_v1",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_lending_v2 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v1_aDai,
          protocolId: "aave_lending_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_amm_aDai,
          protocolId: "aave_lending_v2",
        },
        client,
        aaveUri,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_stable_debt_v2 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_aDai,
          protocolId: "aave_stable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_vDai,
          protocolId: "aave_stable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_variable_debt_v2 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_aDai,
          protocolId: "aave_variable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_sDai,
          protocolId: "aave_variable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_amm_lending_v2 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_aDai,
          protocolId: "aave_amm_lending_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultV1 = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v1_aDai,
          protocolId: "aave_amm_lending_v2",
        },
        client,
        aaveUri,
      );
      expect(resultV1.error).toBeFalsy();
      expect(resultV1.data).not.toBeUndefined();
      expect(resultV1.data).toBe(false);
    });

    test("aave_amm_stable_debt_v2 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_sDai,
          protocolId: "aave_amm_stable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_amm_vDai,
          protocolId: "aave_stable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_amm_variable_debt_v2 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_vDai,
          protocolId: "aave_amm_variable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v2_amm_sDai,
          protocolId: "aave_amm_variable_debt_v2",
        },
        client,
        aaveUri,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_lending_v1 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v1_aUniDai,
          protocolId: "aave_lending_v1",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("aave_uniswap_v1 invalid protocol token", async () => {
      const result = await Aave_Module.isValidProtocolToken(
        {
          tokenAddress: v1_aDai,
          protocolId: "aave_uniswap_v1",
        },
        client,
        aaveUri,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("aave_lending_v2 aDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v2_aDai,
          protocolId: "aave_lending_v2",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_aDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_stable_debt_v2 sDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v2_sDai,
          protocolId: "aave_stable_debt_v2",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_sDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_variable_debt_v2 vDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v2_vDai,
          protocolId: "aave_variable_debt_v2",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_vDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_lending_v2 aDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v2_amm_aDai,
          protocolId: "aave_amm_lending_v2",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_amm_aDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_stable_debt_v2 sDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v2_amm_sDai,
          protocolId: "aave_amm_stable_debt_v2",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_amm_sDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_variable_debt_v2 vDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v2_amm_vDai,
          protocolId: "aave_amm_variable_debt_v2",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v2_amm_vDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_lending_v1 aDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v1_aDai,
          protocolId: "aave_lending_v1",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_aDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_uniswap_v1 aDai", async () => {
      const result = await Aave_Module.getTokenComponents(
        {
          tokenAddress: v1_aUniDai,
          protocolId: "aave_uniswap_v1",
        },
        client,
        aaveUri,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: v1_aUniDai,
        components: [
          {
            tokenAddress: DAI,
            components: [],
            unresolvedComponents: 0,
          },
        ],
      });
      const tokenComponent = result.data as Aave_Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });
  });
});

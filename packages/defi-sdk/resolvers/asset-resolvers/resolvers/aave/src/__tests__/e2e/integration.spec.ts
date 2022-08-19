import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import path from "path";

import { Interface_TokenComponent } from "../../wrap";
import { getConfig } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";

jest.setTimeout(300000);

describe("Aave Token Resolver", () => {
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const v2_aDai = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";
  const v2_sDai = "0x778A13D3eeb110A4f7bb6529F99c000119a08E92";
  const v2_vDai = "0x6C3c78838c761c6Ac7bE9F59fe808ea2A6E4379d";
  const v2_amm_aDai = "0x79bE75FFC64DD58e66787E4Eae470c8a1FD08ba4";
  const v2_amm_sDai = "0x8da51a5a3129343468a63A96ccae1ff1352a3dfE";
  const v2_amm_vDai = "0x3F4fA4937E72991367DC32687BC3278f095E7EAa";
  const v1_aDai = "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d";
  const v1_aUniDai = "0x048930eec73c91B44b0844aEACdEBADC2F2b6efb";

  let client: PolywrapClient;
  let wrapperUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    // build protocol wrapper
    const apiPath: string = path.join(path.resolve(__dirname), "../../../");
    await buildWrapper(apiPath);
    wrapperUri = `wrap://fs/${apiPath}/build`;

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

    client = new PolywrapClient(getConfig(wrapperUri));
  });

  describe("isValidProtocolToken", () => {
    test("aave_lending_v2 aDai", async () => {
      const result = await isValidProtocolToken(v2_aDai, "aave_lending_v2", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_stable_debt_v2 sDai", async () => {
      const result = await isValidProtocolToken(v2_sDai, "aave_stable_debt_v2", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_variable_debt_v2 vDai", async () => {
      const result = await isValidProtocolToken(
        v2_vDai,
        "aave_variable_debt_v2",
        wrapperUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_amm_lending_v2 aDai", async () => {
      const result = await isValidProtocolToken(
        v2_amm_aDai,
        "aave_amm_lending_v2",
        wrapperUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_amm_stable_debt_v2 sDai", async () => {
      const result = await isValidProtocolToken(
        v2_amm_sDai,
        "aave_amm_stable_debt_v2",
        wrapperUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_amm_variable_debt_v2 vDai", async () => {
      const result = await isValidProtocolToken(
        v2_amm_vDai,
        "aave_amm_variable_debt_v2",
        wrapperUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_lending_v1 aDai", async () => {
      const result = await isValidProtocolToken(v1_aDai, "aave_lending_v1", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_uniswap_v1 aUniDai", async () => {
      const result = await isValidProtocolToken(v1_aUniDai, "aave_uniswap_v1", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_lending_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(v1_aDai, "aave_lending_v2", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_amm_aDai,
        "aave_lending_v2",
        wrapperUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_stable_debt_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(v2_aDai, "aave_stable_debt_v2", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_vDai,
        "aave_stable_debt_v2",
        wrapperUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_variable_debt_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        v2_aDai,
        "aave_variable_debt_v2",
        wrapperUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_sDai,
        "aave_variable_debt_v2",
        wrapperUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_amm_lending_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(v2_aDai, "aave_amm_lending_v2", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultV1 = await isValidProtocolToken(
        v1_aDai,
        "aave_amm_lending_v2",
        wrapperUri,
        client,
      );
      expect(resultV1.error).toBeFalsy();
      expect(resultV1.data).not.toBeUndefined();
      expect(resultV1.data).toBe(false);
    });

    test("aave_amm_stable_debt_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        v2_sDai,
        "aave_amm_stable_debt_v2",
        wrapperUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_amm_vDai,
        "aave_stable_debt_v2",
        wrapperUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_amm_variable_debt_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        v2_vDai,
        "aave_amm_variable_debt_v2",
        wrapperUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_amm_sDai,
        "aave_amm_variable_debt_v2",
        wrapperUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_lending_v1 invalid protocol token", async () => {
      const result = await isValidProtocolToken(v1_aUniDai, "aave_lending_v1", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("aave_uniswap_v1 invalid protocol token", async () => {
      const result = await isValidProtocolToken(v1_aDai, "aave_uniswap_v1", wrapperUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("aave_lending_v2 aDai", async () => {
      const result = await getTokenComponents(
        v2_aDai,
        "aave_lending_v2",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_stable_debt_v2 sDai", async () => {
      const result = await getTokenComponents(
        v2_sDai,
        "aave_stable_debt_v2",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_variable_debt_v2 vDai", async () => {
      const result = await getTokenComponents(
        v2_vDai,
        "aave_variable_debt_v2",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_lending_v2 aDai", async () => {
      const result = await getTokenComponents(
        v2_amm_aDai,
        "aave_amm_lending_v2",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_stable_debt_v2 sDai", async () => {
      const result = await getTokenComponents(
        v2_amm_sDai,
        "aave_amm_stable_debt_v2",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_variable_debt_v2 vDai", async () => {
      const result = await getTokenComponents(
        v2_amm_vDai,
        "aave_amm_variable_debt_v2",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_lending_v1 aDai", async () => {
      const result = await getTokenComponents(
        v1_aDai,
        "aave_lending_v1",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_uniswap_v1 aDai", async () => {
      const result = await getTokenComponents(
        v1_aUniDai,
        "aave_uniswap_v1",
        tokenUri,
        wrapperUri,
        client,
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
      const tokenComponent = result.data as Interface_TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: Interface_TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });
  });
});

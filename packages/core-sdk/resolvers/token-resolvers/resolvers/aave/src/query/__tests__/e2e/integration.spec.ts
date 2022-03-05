import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";
import { TokenComponent } from "./types";

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

  let client: Web3ApiClient;
  let testEnvState: {
    ethereum: string;
    ensAddress: string;
    ipfs: string;
  };
  let protocolEnsUri: string;
  let tokenEnsUri: string;

  beforeAll(async () => {
    testEnvState = await initTestEnvironment();
    // get client
    const clientConfig = getPlugins(
      testEnvState.ethereum,
      testEnvState.ipfs,
      testEnvState.ensAddress,
    );
    client = new Web3ApiClient(clientConfig);

    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "../../../../");
    const api = await buildAndDeployApi(apiPath, testEnvState.ipfs, testEnvState.ensAddress);
    protocolEnsUri = `ens/testnet/${api.ensDomain}`;

    // deploy token defiwrapper
    const tokenApiPath: string = path.join(apiPath, "../../../../", "token");
    const tokenApi = await buildAndDeployApi(
      tokenApiPath,
      testEnvState.ipfs,
      testEnvState.ensAddress,
    );
    tokenEnsUri = `ens/testnet/${tokenApi.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("isValidProtocolToken", () => {
    test("aave_lending_v2 aDai", async () => {
      const result = await isValidProtocolToken(v2_aDai, "aave_lending_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_stable_debt_v2 sDai", async () => {
      const result = await isValidProtocolToken(
        v2_sDai,
        "aave_stable_debt_v2",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_variable_debt_v2 vDai", async () => {
      const result = await isValidProtocolToken(
        v2_vDai,
        "aave_variable_debt_v2",
        protocolEnsUri,
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
        protocolEnsUri,
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
        protocolEnsUri,
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
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_lending_v1 aDai", async () => {
      const result = await isValidProtocolToken(v1_aDai, "aave_lending_v1", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("aave_lending_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(v1_aDai, "aave_lending_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_amm_aDai,
        "aave_lending_v2",
        protocolEnsUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_stable_debt_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        v2_aDai,
        "aave_stable_debt_v2",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_vDai,
        "aave_stable_debt_v2",
        protocolEnsUri,
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
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_sDai,
        "aave_variable_debt_v2",
        protocolEnsUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_amm_lending_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        v2_aDai,
        "aave_amm_lending_v2",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultV1 = await isValidProtocolToken(
        v1_aDai,
        "aave_amm_lending_v2",
        protocolEnsUri,
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
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_amm_vDai,
        "aave_stable_debt_v2",
        protocolEnsUri,
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
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);

      const resultAmm = await isValidProtocolToken(
        v2_amm_sDai,
        "aave_amm_variable_debt_v2",
        protocolEnsUri,
        client,
      );
      expect(resultAmm.error).toBeFalsy();
      expect(resultAmm.data).not.toBeUndefined();
      expect(resultAmm.data).toBe(false);
    });

    test("aave_lending_v1 invalid protocol token", async () => {
      const result = await isValidProtocolToken(v2_aDai, "aave_lending_v1", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("aave_lending_v2 aDai", async () => {
      const result = await getTokenComponents(v2_aDai, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_stable_debt_v2 sDai", async () => {
      const result = await getTokenComponents(v2_sDai, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_variable_debt_v2 vDai", async () => {
      const result = await getTokenComponents(v2_vDai, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_lending_v2 aDai", async () => {
      const result = await getTokenComponents(v2_amm_aDai, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_stable_debt_v2 sDai", async () => {
      const result = await getTokenComponents(v2_amm_sDai, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_amm_variable_debt_v2 vDai", async () => {
      const result = await getTokenComponents(v2_amm_vDai, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });

    test("aave_lending_v1 aDai", async () => {
      const result = await getTokenComponents(v1_aDai, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBe(1);
    });
  });
});
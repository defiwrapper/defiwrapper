import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { Interface_TokenComponent as TokenComponent } from "../../w3";
import { getPlugins, TestEnvironment } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";

jest.setTimeout(300000);

describe("1Inch Token Resolver", () => {
  const USDC_DAI_V2 = "0x05D7BC2a5eC390743edEc5AA9F9Fe35aa87Efa43";
  const ETH_WBTC_V2 = "0x6a11F3E5a01D129e566d783A7b6E8862bFD66CcA";
  const ETH_WBTC_V1 = "0x322A1E2e18Fffc8d19948581897b2c49b3455240";
  const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const CHI = "0x0000000000004946c0e9F43F4Dee607b0eF1fA1c";

  let client: Web3ApiClient;
  let testEnv: TestEnvironment;
  let protocolEnsUri: string;
  let tokenEnsUri: string;

  beforeAll(async () => {
    testEnv = await initTestEnvironment();
    // get client
    const clientConfig = getPlugins(testEnv.ethereum, testEnv.ipfs, testEnv.ensAddress);
    client = new Web3ApiClient(clientConfig);

    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "../../../../");
    const api = await buildAndDeployApi({
      apiAbsPath: apiPath,
      ipfsProvider: testEnv.ipfs,
      ensRegistryAddress: testEnv.ensAddress,
      ensRegistrarAddress: testEnv.registrarAddress,
      ensResolverAddress: testEnv.resolverAddress,
      ethereumProvider: testEnv.ethereum,
    });
    protocolEnsUri = `ens/testnet/${api.ensDomain}`;

    // deploy token defiwrapper
    const tokenApiPath: string = path.join(
      apiPath,
      "..",
      "..",
      "..",
      "token-resolvers",
      "resolvers",
      "ethereum",
    );
    const tokenApi = await buildAndDeployApi({
      apiAbsPath: tokenApiPath,
      ipfsProvider: testEnv.ipfs,
      ensRegistryAddress: testEnv.ensAddress,
      ensRegistrarAddress: testEnv.registrarAddress,
      ensResolverAddress: testEnv.resolverAddress,
      ethereumProvider: testEnv.ethereum,
    });
    tokenEnsUri = `ens/testnet/${tokenApi.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("isValidTokenProtocol", () => {
    test("1inch_v2 USDC-DAI pool", async () => {
      const result = await isValidProtocolToken(USDC_DAI_V2, "1inch_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("1inch_v2 ETH_WBTC pool", async () => {
      const result = await isValidProtocolToken(ETH_WBTC_V2, "1inch_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("1inch_v1 ETH_WBTC pool", async () => {
      const result = await isValidProtocolToken(ETH_WBTC_V1, "1inch_v1", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("1inch_chi CHI", async () => {
      const result = await isValidProtocolToken(CHI, "1inch_chi", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token v2", async () => {
      const result = await isValidProtocolToken(ETH_WBTC_V1, "1inch_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("invalid protocol token v1", async () => {
      const result = await isValidProtocolToken(ETH_WBTC_V2, "1inch_v1", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("invalid protocol token chi", async () => {
      const result = await isValidProtocolToken(ETH_WBTC_V2, "1inch_chi", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("1inch_v2 USDC-DAI pool", async () => {
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

      const result = await getTokenComponents(
        USDC_DAI_V2,
        "1inch_v2",
        tokenEnsUri,
        protocolEnsUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: USDC_DAI_V2,
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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });

    test("1inch_v2 ETH-WBTC pool", async () => {
      const result = await getTokenComponents(
        ETH_WBTC_V2,
        "1inch_v2",
        tokenEnsUri,
        protocolEnsUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: ETH_WBTC_V2,
        components: [
          {
            tokenAddress: ETH,
            components: [],
            unresolvedComponents: 0,
          },
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
      expect(sum).toBeGreaterThan(0);
    });

    test("1inch_v1 ETH-WBTC pool", async () => {
      const result = await getTokenComponents(
        ETH_WBTC_V1,
        "1inch_v1",
        tokenEnsUri,
        protocolEnsUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: ETH_WBTC_V1,
        components: [
          {
            tokenAddress: ETH,
            components: [],
            unresolvedComponents: 0,
          },
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
      expect(sum).toBeGreaterThan(0);
    });

    test("1inch_chi CHI", async () => {
      const result = await getTokenComponents(
        CHI,
        "1inch_chi",
        tokenEnsUri,
        protocolEnsUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: CHI,
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
      expect(sum).toBeGreaterThan(0);
    });
  });
});

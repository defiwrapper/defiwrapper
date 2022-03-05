import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";
import { TokenComponent } from "./types";

jest.setTimeout(300000);

describe("Sushi Token Resolver", () => {
  const USDC_WETH_POOL = "0x397ff1542f962076d0bfe58ea045ffa2d347aca0";
  const XSUSHI_ADDRESS = "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272";

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

  describe("isValidTokenProtocol", () => {
    test("sushiswap_v1 USDC-WETH pool", async () => {
      const result = await isValidProtocolToken(
        USDC_WETH_POOL,
        "sushiswap_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("sushibar_v1", async () => {
      const result = await isValidProtocolToken(
        XSUSHI_ADDRESS,
        "sushibar_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        XSUSHI_ADDRESS,
        "sushiswap_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        USDC_WETH_POOL,
        "sushibar_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("sushiswap_v1 USDC-WETH pool", async () => {
      const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

      const result = await getTokenComponents(USDC_WETH_POOL, tokenEnsUri, protocolEnsUri, client);

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: USDC_WETH_POOL,
        components: [
          {
            tokenAddress: USDC,
            components: [],
            unresolvedComponents: 0,
          },
          {
            tokenAddress: WETH,
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

    test("sushibar_v1", async () => {
      const SUSHI_ADDRESS = "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2";

      const result = await getTokenComponents(XSUSHI_ADDRESS, tokenEnsUri, protocolEnsUri, client);

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: XSUSHI_ADDRESS,
        components: [
          {
            tokenAddress: SUSHI_ADDRESS,
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

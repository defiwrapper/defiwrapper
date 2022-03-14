import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { Interface_TokenComponent } from "../../w3";
import { getPlugins } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";

jest.setTimeout(300000);

describe("Balancer Token Resolver", () => {
  const DAI_USDC_USDT_POOL_V2 = "0x06df3b2bbb68adc8b0e302443692037ed9f91b42";
  const AMPL_WETH_WBTC_POOL_V1 = "0xa751A143f8fe0a108800Bfb915585E4255C2FE80";
  const BPT_ILV_SMART_POOL_V1 = "0xF657666C7823c68dCca168C4C1c9a28d9D04Ec29";

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
    test("balancer_v2 DAI-USDC-USDT pool", async () => {
      const result = await isValidProtocolToken(
        DAI_USDC_USDT_POOL_V2,
        "balancer_v2",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("balancer_v1 AMPL-WETH-WBTC pool", async () => {
      const result = await isValidProtocolToken(
        AMPL_WETH_WBTC_POOL_V1,
        "balancer_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("balancer_v1 BPT-ILV smart pool", async () => {
      const result = await isValidProtocolToken(
        BPT_ILV_SMART_POOL_V1,
        "balancer_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("balancer_v2 invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        BPT_ILV_SMART_POOL_V1,
        "balancer_v2",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });

    test("balancer_v1 invalid protocol token", async () => {
      const result = await isValidProtocolToken(
        DAI_USDC_USDT_POOL_V2,
        "balancer_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("balancer_v2 DAI-USDC-USDT pool", async () => {
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

      const result = await getTokenComponents(
        DAI_USDC_USDT_POOL_V2,
        "balancer_v2",
        tokenEnsUri,
        protocolEnsUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: DAI_USDC_USDT_POOL_V2,
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
          {
            tokenAddress: USDT,
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
      expect(sum).toBeGreaterThan(0.95);
      expect(sum).toBeLessThan(1.05);
    });
  });
});

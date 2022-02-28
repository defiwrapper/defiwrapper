import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";
import { TokenComponent } from "./types";

jest.setTimeout(300000);

describe("Uniswap Token Resolver", () => {
  const USDC_DAI_POOL = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5";

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
  });

  beforeAll(async () => {
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

  // beforeAll(async () => {
  //   const V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  //   const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  //   const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  //   const lpTokenInvoke = await client.invoke<string>({
  //     uri: "w3://ens/ethereum.web3api.eth",
  //     module: "query",
  //     method: "callContractView",
  //     input: {
  //       address: V2_FACTORY_ADDRESS,
  //       method:
  //         "function getPair(address tokenA, address tokenB) external view returns (address pair)",
  //       args: [USDC, DAI],
  //       connection: {
  //         networkNameOrChainId: "1",
  //       },
  //     },
  //   });
  //   expect(lpTokenInvoke.error).toBeFalsy();
  //   expect(lpTokenInvoke.data).toBeTruthy();
  //   USDC_DAI_POOL = lpTokenInvoke.data as string;
  // });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("isValidTokenProtocol", () => {
    test("uniswap_v2 USDC-DAI pool", async () => {
      const result = await isValidProtocolToken(
        USDC_DAI_POOL,
        "uniswap_v2",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await isValidProtocolToken("0x1", "uniswap_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("uniswap_v2 USDC-DAI pool", async () => {
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

      const result = await getTokenComponents(USDC_DAI_POOL, tokenEnsUri, protocolEnsUri, client);

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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0.95);
      expect(sum).toBeLessThan(1.05);
    });
  });
});

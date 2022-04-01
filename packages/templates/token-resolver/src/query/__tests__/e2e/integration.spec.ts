import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { Interface_TokenComponent as TokenComponent } from "../../w3";
import { getPlugins } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";

jest.setTimeout(300000);

describe.skip("Foo Token Resolver", () => {
  const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  const ETH_WBTC_POOL_V2 = "0x00";

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
    test("foo_v2 ETH-WBTC pool", async () => {
      const result = await isValidProtocolToken(ETH_WBTC_POOL_V2, "foo_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("foo_V2 invalid protocol token", async () => {
      const result = await isValidProtocolToken("0x1", "foo_v2", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("foo_v2 ETH-WBTC pool", async () => {
      const ETH = ETH_ADDRESS;
      const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

      const result = await getTokenComponents(
        ETH_WBTC_POOL_V2,
        "foo_v2",
        tokenEnsUri,
        protocolEnsUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
        rate: "1",
        unresolvedComponents: 0,
        tokenAddress: ETH_WBTC_POOL_V2,
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
  });
});

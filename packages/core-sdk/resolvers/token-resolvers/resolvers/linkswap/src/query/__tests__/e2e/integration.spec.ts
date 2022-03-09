import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";
import { TokenComponent } from "./types";

jest.setTimeout(300000);

describe("Linkswap Token Resolver", () => {
  const LINK_DOKI_POOL = "0xbe755C548D585dbc4e3Fe4bcD712a32Fd81e5Ba0";

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
    test("linkswap_v1 USDC-DAI pool", async () => {
      const result = await isValidProtocolToken(
        LINK_DOKI_POOL,
        "linkswap_v1",
        protocolEnsUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await isValidProtocolToken("0x1", "linkswap_v1", protocolEnsUri, client);
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(false);
    });
  });

  describe("getTokenComponents", () => {
    test("linkswap_v1 USDC-DAI pool", async () => {
      const LINK = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
      const DOKI = "0x9cEB84f92A0561fa3Cc4132aB9c0b76A59787544";

      const result = await getTokenComponents(
        LINK_DOKI_POOL,
        "linkswap_v1",
        tokenEnsUri,
        protocolEnsUri,
        client,
      );

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toMatchObject({
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
      const tokenComponent = result.data as TokenComponent;
      let sum = 0;
      tokenComponent.components.forEach((x: TokenComponent) => {
        sum += +x.rate;
      });
      expect(sum).toBeGreaterThan(0);
    });
  });
});

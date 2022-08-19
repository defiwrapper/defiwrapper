import { PolywrapClient } from "@polywrap/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@polywrap/test-env-js";
import path from "path";

import { Interface_TokenComponent as TokenComponent } from "../../wrap";
import { getPlugins, TestEnvironment } from "../utils";
import { getTokenComponents, isValidProtocolToken } from "./apiCalls";

jest.setTimeout(300000);

describe("Linkswap Token Resolver", () => {
  const LINK_DOKI_POOL = "0xbe755C548D585dbc4e3Fe4bcD712a32Fd81e5Ba0";

  let client: PolywrapClient;
  let testEnv: TestEnvironment;
  let protocolUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    testEnv = await initTestEnvironment();
    // get client
    const clientConfig = getPlugins(testEnv.ethereum, testEnv.ipfs, testEnv.ensAddress);
    client = new PolywrapClient(clientConfig);

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
    protocolUri = `ens/testnet/${api.ensDomain}`;

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
    tokenUri = `ens/testnet/${tokenApi.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("isValidTokenProtocol", () => {
    test("linkswap_v1 USDC-DAI pool", async () => {
      const result = await isValidProtocolToken(
        LINK_DOKI_POOL,
        "linkswap_v1",
        protocolUri,
        client,
      );
      expect(result.error).toBeFalsy();
      expect(result.data).not.toBeUndefined();
      expect(result.data).toBe(true);
    });

    test("invalid protocol token", async () => {
      const result = await isValidProtocolToken("0x1", "linkswap_v1", protocolUri, client);
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
        tokenUri,
        protocolUri,
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

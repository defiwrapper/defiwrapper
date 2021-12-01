import { ClientConfig, QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { GetComponentsResponse, TokenProtocolType } from "./types";

jest.setTimeout(200000);

describe("DefiSDK polygon network tests", () => {
  let client: Web3ApiClient;
  let ensUri: string;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const config: ClientConfig = getPlugins(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient(config);
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "..", "..", "..");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getComponents = async (address: string): Promise<QueryApiResult<GetComponentsResponse>> => {
    const response = await client.query<GetComponentsResponse>({
      uri: ensUri,
      query: `
        query GetComponents($address: String!, $node: String!) {
          getComponents(
            address: $address
            connection: {
              node: $node
              networkNameOrChainId: null
            }
          )
        }
      `,
      variables: {
        address: address,
        node: "https://polygon-rpc.com/",
      },
    });
    return response;
  };

  test("Aave V2", async () => {
    const response = await getComponents("0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360");
    expect(response.errors).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data?.getComponents).toBeTruthy();
    expect(response.data?.getComponents.token).toMatchObject({
      address: "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360",
      name: "Aave Matic Market AAVE",
      symbol: "amAAVE",
      decimals: 18,
    });
    expect(response.data?.getComponents.type).toBe(TokenProtocolType.AaveV2);
    expect(response.data?.getComponents.underlyingTokenComponents.length).toBe(1);
    expect(response.data?.getComponents.underlyingTokenComponents[0]).toMatchObject({
      token: {
        address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        name: "Aave (PoS)",
        symbol: "AAVE",
        decimals: 18,
      },
      rate: "1",
      type: TokenProtocolType.Native,
    });
  });
});

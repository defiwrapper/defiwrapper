import { ClientConfig, QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { GetComponentsResponse, TokenProtocolType } from "./types";

jest.setTimeout(300000);

describe("DefiSDK mainnet network tests", () => {
  let client: Web3ApiClient;
  let ensUri: string;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const config: Partial<ClientConfig> = getPlugins(testEnvEtherem, ipfs, ensAddress);
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
        query GetComponents($address: String!, $network: String!) {
          getComponents(
            address: $address
            connection: {
              node: null,
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: {
        address: address,
        network: "MAINNET",
      },
    });
    return response;
  };

  test("Aave V1", async () => {
    const response = await getComponents("0x9bA00D6856a4eDF4665BcA2C2309936572473B7E");
    expect(response.errors).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data?.getComponents).toBeTruthy();
    expect(response.data?.getComponents.token).toMatchObject({
      address: "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E",
      name: "Aave Interest bearing USDC",
      symbol: "aUSDC",
      decimals: 6,
    });
    expect(response.data?.getComponents.type).toBe(TokenProtocolType.AaveV1);
    expect(response.data?.getComponents.underlyingTokenComponents.length).toBe(1);
    expect(response.data?.getComponents.underlyingTokenComponents[0]).toMatchObject({
      token: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
      },
      rate: "1",
      type: TokenProtocolType.Native,
    });
  });

  test("Aave V2", async () => {
    const response = await getComponents("0x028171bca77440897b824ca71d1c56cac55b68a3");
    expect(response.errors).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data?.getComponents).toBeTruthy();
    expect(response.data?.getComponents.token).toMatchObject({
      address: "0x028171bca77440897b824ca71d1c56cac55b68a3",
      name: "Aave interest bearing DAI",
      symbol: "aDAI",
      decimals: 18,
    });
    expect(response.data?.getComponents.type).toBe(TokenProtocolType.AaveV2);
    expect(response.data?.getComponents.underlyingTokenComponents.length).toBe(1);
    expect(response.data?.getComponents.underlyingTokenComponents[0]).toMatchObject({
      token: {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        name: "Dai Stablecoin",
        symbol: "DAI",
        decimals: 18,
      },
      rate: "1",
      type: TokenProtocolType.Native,
    });
  });
});

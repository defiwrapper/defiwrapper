import { QueryApiResult, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import { ResolveProtocolResponse } from "./types";

jest.setTimeout(300000);

describe("Ethereum protocol resolver tests", () => {
  let client: Web3ApiClient;
  let ensUri: string;

  // beforeAll(async () => {
  //   const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
  //   // get client
  //   const config = getPlugins(testEnvEtherem, ipfs, ensAddress);
  //   client = new Web3ApiClient(config);
  //   // deploy api
  //   const apiPath: string = path.join(path.resolve(__dirname), "..", "..", "..");
  //   const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
  //   ensUri = `ens/testnet/${api.ensDomain}`;
  // });

  // afterAll(async () => {
  //   await stopTestEnvironment();
  // });

  const resolveProtocol = async (): Promise<QueryApiResult<ResolveProtocolResponse>> => {
    const response = await client.query<ResolveProtocolResponse>({
      uri: ensUri,
      query: `
        query ResolveProtocol($token: Token!) {
          resolveProtocol(
            token: Token!
          )
        }
      `,
      variables: {
        token: {
          address: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
          name: "SushiBar",
          symbol: "xSUSHI",
          decimals: 18,
          totalSupply: "68828762817907898982295808",
        },
      },
    });
    return response;
  };

  test("ResolveProtocol", async () => {
    const result = await resolveProtocol();

    console.log(result);
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data?.resolveProtocol).toBeTruthy();
  });
});

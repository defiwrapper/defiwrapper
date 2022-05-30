import {
  InterfaceImplementations,
  QueryApiResult,
  UriRedirect,
  Web3ApiClient,
} from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";
import {
  GetTokenBalancesResponse,
  GetTokenTransfersResponse,
  GetTransactionsResponse,
  Options,
} from "./types";

jest.setTimeout(500000);

describe("Ethereum", () => {
  let client: Web3ApiClient;
  let ensUri: string;
  let tokenEnsUri: string;

  beforeAll(async () => {
    const {
      ethereum: testEnvEthereum,
      ensAddress,
      ipfs,
      registrarAddress,
      resolverAddress,
    } = await initTestEnvironment();
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "..", "..", "..", "..");
    const api = await buildAndDeployApi({
      apiAbsPath: apiPath,
      ipfsProvider: ipfs,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress: registrarAddress,
      ensResolverAddress: resolverAddress,
      ethereumProvider: testEnvEthereum,
    });
    ensUri = `ens/testnet/${api.ensDomain}`;

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
      ipfsProvider: ipfs,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress: registrarAddress,
      ensResolverAddress: resolverAddress,
      ethereumProvider: testEnvEthereum,
    });
    tokenEnsUri = `ens/testnet/${tokenApi.ensDomain}`;

    // get client
    const config = getPlugins(testEnvEthereum, ipfs, ensAddress);
    config.envs = [
      {
        uri: ensUri,
        query: {
          apiKey: process.env.COVALENT_API_KEY || "ckey_910089969da7451cadf38655ede",
          chainId: 1,
          vsCurrency: "USD",
          format: "JSON",
        },
      },
      {
        uri: tokenEnsUri,
        query: {
          connection: {
            networkNameOrChainId: "MAINNET",
          },
        },
      },
    ];
    const ethInterface: InterfaceImplementations<string> = {
      interface: "ens/interface.token.resolvers.defiwrapper.eth",
      implementations: [tokenEnsUri],
    };
    config.interfaces = config.interfaces ? [...config.interfaces, ethInterface] : [ethInterface];

    const ethRedirect: UriRedirect<string> = {
      to: tokenEnsUri,
      from: "ens/ethereum.token.resolvers.defiwrapper.eth",
    };
    config.redirects = config.redirects ? [...config.redirects, ethRedirect] : [ethRedirect];

    client = new Web3ApiClient(config);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("getTokenBalances", () => {
    const getTokenBalances = async (
      address: string,
    ): Promise<QueryApiResult<GetTokenBalancesResponse>> => {
      const response = await client.query<GetTokenBalancesResponse>({
        uri: ensUri,
        query: `
          query GetTokenBalances($address: String!) {
            getTokenBalances(
              accountAddress: $address
            )
          }
        `,
        variables: {
          address: address,
        },
      });
      return response;
    };

    test("0x9bA00D6856a4eDF4665BcA2C2309936572473B7E", async () => {
      const result = await getTokenBalances("0x9bA00D6856a4eDF4665BcA2C2309936572473B7E");

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      const tokenBalances = result.data?.getTokenBalances.tokenBalances as {
        token: { address: string };
        quote: string;
        quoteRate: string;
        balance: string;
      }[];
      const usdcBalance = tokenBalances.find(
        (x) => x.token.address === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      );
      expect(usdcBalance).toBeDefined();
      expect(+usdcBalance!.balance).toBeGreaterThan(0);
      expect(+usdcBalance!.quote).toBeGreaterThan(0);
      expect(+usdcBalance!.quoteRate).toBeGreaterThan(0);
    });
  });

  describe("getTransactions", () => {
    const getTransactions = async (
      address: string,
      options: Options | null = null,
    ): Promise<QueryApiResult<GetTransactionsResponse>> => {
      const response = await client.query<GetTransactionsResponse>({
        uri: ensUri,
        query: `
          query GetTransactions($address: String!, $options: Options!) {
            getTransactions(
              accountAddress: $address,
              options: $options
            )
          }
        `,
        variables: {
          address: address,
          options: options,
        },
      });
      return response;
    };

    test("0xa79e63e78eec28741e711f89a672a4c40876ebf3", async () => {
      const result = await getTransactions("0xa79e63e78eec28741e711f89a672a4c40876ebf3", {
        pagination: {
          page: 1,
          perPage: 2,
        },
        blockRange: null,
      });

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      const transactions = result.data?.getTransactions.transactions as {
        hash: string;
      }[];
      expect(transactions).toHaveLength(2);
    });
  });

  describe("getTokenTransfers", () => {
    const getTokenTransfers = async (
      address: string,
      tokenAddress: string,
      options: Options | null = null,
    ): Promise<QueryApiResult<GetTokenTransfersResponse>> => {
      const response = await client.query<GetTokenTransfersResponse>({
        uri: ensUri,
        query: `
          query GetTokenTransfers(
            $address: String!, 
            $tokenAddress: String!,
            $options: Options!
          ) {
            getTokenTransfers(
              accountAddress: $address,
              tokenAddress: $tokenAddress,
              options: $options
            )
          }
        `,
        variables: {
          address: address,
          tokenAddress: tokenAddress,
          options: options,
        },
      });
      return response;
    };

    test("0xa79e63e78eec28741e711f89a672a4c40876ebf3 - USDC", async () => {
      const result = await getTokenTransfers(
        "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        {
          pagination: {
            page: 1,
            perPage: 2,
          },
          blockRange: null,
        },
      );

      expect(result.errors).toBeFalsy();
      expect(result.data).toBeTruthy();
      const transfers = result.data?.getTokenTransfers.transfers as {
        transaction: { hash: string };
      }[];

      expect(transfers).toHaveLength(2);
    });
  });
});

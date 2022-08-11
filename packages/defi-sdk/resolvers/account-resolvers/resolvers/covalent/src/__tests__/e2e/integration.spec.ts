import {
  InterfaceImplementations,
  InvokeResult,
  UriRedirect,
  PolywrapClient,
} from "@polywrap/client-js";
import {buildWrapper, ensAddresses, providers } from "@polywrap/test-env-js";
import path from "path";

import { getPlugins, initInfra, stopInfra } from "../utils";
import {
  Options,
} from "./types";
import {
  AccountResolver_TokenBalancesList,
  AccountResolver_TransactionsList,
  AccountResolver_TransfersList
} from "../../wrap";

jest.setTimeout(500000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let uri: string;
  let tokenUri: string;

  beforeAll(async () => {
    await initInfra();
    // deploy api
    const apiPath: string = path.join(path.resolve(__dirname), "../../..");
    await buildWrapper(apiPath);
    uri = `fs/${apiPath}/build`;

    // deploy token defiwrapper
    const tokenWrapperPath: string = path.join(apiPath + "../../../../token-resolvers/resolvers/ethereum")
    await buildWrapper(tokenWrapperPath);
    tokenUri = `fs/${tokenWrapperPath}/build`;

    // get client
    const config = getPlugins(providers.ethereum, providers.ipfs, ensAddresses.ensAddress);
    config.envs = [
      {
        uri: uri,
        env: {
          apiKey: process.env.COVALENT_API_KEY || "ckey_910089969da7451cadf38655ede",
          chainId: 1,
          vsCurrency: "USD",
          format: "JSON",
        }
      },
      {
        uri: tokenUri,
        env: {
          connection: {
            networkNameOrChainId: "MAINNET",
          },
        },
      },
    ];
    const ethInterface: InterfaceImplementations<string> = {
      interface: "ens/interface.token.resolvers.defiwrapper.eth",
      implementations: [tokenUri],
    };
    config.interfaces = config.interfaces ? [...config.interfaces, ethInterface] : [ethInterface];

    const ethRedirect: UriRedirect<string> = {
      to: tokenUri,
      from: "ens/ethereum.token.resolvers.defiwrapper.eth",
    };
    config.redirects = config.redirects ? [...config.redirects, ethRedirect] : [ethRedirect];

    client = new PolywrapClient(config);
  });

  afterAll(async () => {
    await stopInfra();
  });

  describe("getTokenBalances", () => {
    const getTokenBalances = async (
      address: string,
    ): Promise<InvokeResult<AccountResolver_TokenBalancesList>> => {
      return await client.invoke<AccountResolver_TokenBalancesList>({
        uri,
        method: "getTokenBalances",
        args: {
          accountAddress: address
        }
      });
    };

    test("0x9bA00D6856a4eDF4665BcA2C2309936572473B7E", async () => {
      const result = await getTokenBalances("0x9bA00D6856a4eDF4665BcA2C2309936572473B7E");

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      const tokenBalances = result.data?.tokenBalances as {
        token: { address: string };
        quote: string;
        quoteRate: string;
        balance: string;
      }[];
      console.log(result)
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
    ): Promise<InvokeResult<AccountResolver_TransactionsList>> => {
      return await client.invoke<AccountResolver_TransactionsList>({
        uri: uri,
        method: "getTransactions",
        args: {
          accountAddress: address,
          options
        }
      })
    };

    test("0xa79e63e78eec28741e711f89a672a4c40876ebf3", async () => {
      const result = await getTransactions("0xa79e63e78eec28741e711f89a672a4c40876ebf3", {
        pagination: {
          page: 1,
          perPage: 2,
        },
        blockRange: null,
      });

      expect(result.error).toBeFalsy();

      expect(result.data).toBeTruthy();
      const transactions = result.data?.transactions as {
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
    ): Promise<InvokeResult<AccountResolver_TransfersList>> => {
      return await client.invoke<AccountResolver_TransfersList>({
        uri,
        method: "getTokenTransfers",
        args: {
          accountAddress: address,
          tokenAddress: tokenAddress,
          options: options,
        },
      });
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

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      const transfers = result.data?.transfers as {
        transaction: { hash: string };
      }[];

      expect(transfers).toHaveLength(2);
    });
  });
});

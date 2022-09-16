import { InvokeResult, PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";

import { getConfig, getWrapperPaths } from "../../../config/util";
import {
  AccountResolver_Options,
  AccountResolver_TokenBalancesList,
  AccountResolver_TransactionsList,
  AccountResolver_TransfersList,
} from "../types";
import { initInfra, stopInfra } from "../utils";

jest.setTimeout(800000);

describe("Ethereum", () => {
  let client: PolywrapClient;
  let wrapperUri: string;
  let tokenUri: string;

  beforeAll(async () => {
    await initInfra();

    // deploy api
    const { wrapperAbsPath, tokenResolverAbsPath } = getWrapperPaths();
    await buildWrapper(tokenResolverAbsPath);
    await buildWrapper(wrapperAbsPath);
    tokenUri = `fs/${tokenResolverAbsPath}/build`;
    wrapperUri = `fs/${wrapperAbsPath}/build`;

    // get client
    const config = getConfig(wrapperUri, tokenUri, "http://localhost:8546");
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
        uri: wrapperUri,
        method: "getTokenBalances",
        args: {
          accountAddress: address,
        },
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
      options: AccountResolver_Options | null = null,
    ): Promise<InvokeResult<AccountResolver_TransactionsList>> => {
      return await client.invoke<AccountResolver_TransactionsList>({
        uri: wrapperUri,
        method: "getTransactions",
        args: {
          accountAddress: address,
          options,
        },
      });
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
      options: AccountResolver_Options | null = null,
    ): Promise<InvokeResult<AccountResolver_TransfersList>> => {
      return await client.invoke<AccountResolver_TransfersList>({
        uri: wrapperUri,
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

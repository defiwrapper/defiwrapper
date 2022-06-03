import { Nullable } from "@web3api/wasm-as";

import { getNTransactions } from "../helpers/transactions";
import { Input_getTransactions, Options, PaginationOptions, TransactionsList } from "../w3";
import { Ethereum_Network, Ethereum_Query } from "../w3/imported";
import { MAR_Query } from "../w3/imported/MAR_Query";

export function getTransactions(input: Input_getTransactions): TransactionsList {
  if (!MAR_Query.requireEnv({}).unwrap()) {
    throw new Error("requireEnv() returned false");
  }
  const network: Ethereum_Network = Ethereum_Query.getNetwork({ connection: null }).unwrap();

  let perPage: i32 = 10;
  let page: i32 = 1;

  if (input.options) {
    const options = input.options as Options;
    if (options.pagination) {
      const pagination = options.pagination as PaginationOptions;
      perPage = pagination.perPage;
      page = pagination.page;
    }
  }

  const totalTxns = perPage + 5;
  const hasMore = totalTxns > perPage * page;

  return {
    account: input.accountAddress,
    chainId: network.chainId.toString(),
    quoteCurrency: input.vsCurrency,
    transactions: getNTransactions(totalTxns, input.accountAddress),
    pagination: {
      total: Nullable.fromValue(totalTxns),
      perPage: Nullable.fromValue(perPage),
      page: Nullable.fromValue(page),
      hasMore: Nullable.fromValue(hasMore),
    },
    updatedAt: "2022-04-01T10:36:17.111543568Z",
    nextUpdateAt: "2022-04-01T10:41:17.111543858Z",
  };
}

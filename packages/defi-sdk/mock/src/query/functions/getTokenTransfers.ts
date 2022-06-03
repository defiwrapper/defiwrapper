import { Nullable } from "@web3api/wasm-as";

import { getToken } from "../helpers/constants/tokenInfo";
import { getRandomTransfer } from "../helpers/constants/tokenTransfer";
import {
  Input_getTokenTransfers,
  Options,
  PaginationOptions,
  TransfersList,
  TransfersPerTx,
} from "../w3";
import { Ethereum_Network, Ethereum_Query } from "../w3/imported";
import { MAR_Query } from "../w3/imported/MAR_Query";

// TODO: add simple assets andd create token transfers for those
export function getTokenTransfers(input: Input_getTokenTransfers): TransfersList {
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

  const totalTxns = perPage + 2;
  const hasMore = totalTxns > perPage * page;
  const token = getToken(input.tokenAddress);

  const transfers: TransfersPerTx[] = [];
  for (let i = 0; i < totalTxns; i++) {
    transfers.push(getRandomTransfer(input.accountAddress, input.tokenAddress));
  }

  return {
    account: input.accountAddress,
    updatedAt: "2022-04-01T04:06:53.745976993Z",
    nextUpdateAt: "2022-04-01T04:11:53.745977273Z",
    quoteCurrency: "usd",
    chainId: network.chainId.toString(),
    token: token,
    transfers: transfers,
    pagination: {
      hasMore: Nullable.fromValue(hasMore),
      page: Nullable.fromValue(page),
      perPage: Nullable.fromValue(perPage),
      total: Nullable.fromValue(totalTxns),
    },
  };
}

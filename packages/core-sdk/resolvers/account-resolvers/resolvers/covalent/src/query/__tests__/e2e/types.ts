import { AccountResolver_Options, AccountResolver_TokenBalance, AccountResolver_TransactionsList, AccountResolver_TransfersList } from "../../w3";

export type Token = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: string;
};

export type Protocol = {
  id: string;
  organization: string;
  name: string;
  version: string;
  forkedFrom: Protocol | null;
};

export type GetTokenBalancesResponse = {
  getTokenBalances: Array<AccountResolver_TokenBalance>;
};

export type Options = AccountResolver_Options;

export type GetTransactionsResponse = {
  getTransactions: AccountResolver_TransactionsList;
};

export type GetTokenTransfersResponse = {
  getTokenTransfers: AccountResolver_TransfersList;
};

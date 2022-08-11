import {
  AccountResolver_Options,
  AccountResolver_TransactionsList,
  AccountResolver_TransfersList,
  AccountResolver_TokenBalancesList
} from "../../wrap";

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
  getTokenBalances: AccountResolver_TokenBalancesList;
};

export type Options = AccountResolver_Options;

export type GetTransactionsResponse = {
  getTransactions: AccountResolver_TransactionsList;
};

export type GetTokenTransfersResponse = {
  getTokenTransfers: AccountResolver_TransfersList;
};

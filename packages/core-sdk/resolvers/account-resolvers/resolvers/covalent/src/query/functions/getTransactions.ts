import { JSON } from "@web3api/wasm-as";

import { COVALENT_API } from "../constants";
import {
  buildUrl,
  getNullableArrayProperty,
  getNullableObjectProperty,
  getStringProperty,
  parseJsonPagination,
  parseJsonTxns,
} from "../utils";
import {
  AccountResolver_TransactionsList,
  env,
  Http_Query,
  Http_ResponseType,
  Http_UrlParam,
  Input_getTransactions,
  QueryEnv,
} from "../w3";

export function getTransactions(input: Input_getTransactions): AccountResolver_TransactionsList {
  if (!env) throw new Error("env is not defined");

  const chainId = (env as QueryEnv).chainId.toString();
  const apiKey = (env as QueryEnv).apiKey;
  const url = buildUrl([
    COVALENT_API,
    "v1",
    chainId,
    "address",
    input.accountAddress,
    "transactions_v2",
  ]);

  const params: Http_UrlParam[] = [
    {
      key: "key",
      value: apiKey,
    },
    {
      key: "quote-currency",
      value: input.vsCurrency,
    },
  ];

  const paginationOptions = input.options.pagination;
  if (paginationOptions) {
    params.push({
      key: "page-number",
      value: paginationOptions.page.toString(),
    });
    params.push({
      key: "page-size",
      value: paginationOptions.perPage.toString(),
    });
  }

  const blockRangeOptions = input.options.blockRange;
  if (blockRangeOptions) {
    const startBlockOption = blockRangeOptions.startBlock.isNull
      ? blockRangeOptions.startBlock.value.toString()
      : "0";
    const endBlockOption = blockRangeOptions.endBlock.isNull
      ? blockRangeOptions.endBlock.value.toString()
      : "latest";
    params.push({
      key: "starting-block",
      value: startBlockOption,
    });
    params.push({
      key: "ending-block",
      value: endBlockOption,
    });
  }

  const res = Http_Query.get({
    url: url,
    request: {
      headers: null,
      urlParams: params,
      responseType: Http_ResponseType.TEXT,
      body: null,
    },
  });

  if (res.isErr) {
    throw new Error(res.unwrapErr());
  }
  const response = res.unwrap();

  if (!response || response.status !== 200 || !response.body) {
    const errorMsg =
      response && response.statusText
        ? (response.statusText as string)
        : "An error occurred while fetching data";
    throw new Error(errorMsg);
  }

  const json = JSON.parse(response.body as string);
  if (!json || !json.isObj) throw new Error("Invalid response");

  const jsonData = (json as JSON.Obj).getObj("data");
  if (!jsonData || !jsonData.isObj) throw new Error("Invalid response body!");

  return {
    account: getStringProperty(jsonData, "address"),
    chainId: getStringProperty(jsonData, "chain_id"),
    quoteCurrency: getStringProperty(jsonData, "quote_currency"),
    transactions: parseJsonTxns(getNullableArrayProperty(jsonData, "items")),
    pagination: parseJsonPagination(getNullableObjectProperty(jsonData, "pagination")),
    updatedAt: getStringProperty(jsonData, "updated_at"),
    nextUpdateAt: getStringProperty(jsonData, "next_update_at"),
  };
}

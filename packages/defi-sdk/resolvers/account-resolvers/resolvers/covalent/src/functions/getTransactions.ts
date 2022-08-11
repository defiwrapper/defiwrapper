import { JSON } from "@polywrap/wasm-as";

import { COVALENT_API } from "../constants";
import {
  buildUrl,
  getGlobalUrlParams,
  getNullableArrayProperty,
  getNullableObjectProperty,
  getNullableStringProperty,
  getStringProperty,
  parseJsonPagination,
  parseJsonTxns,
} from "../utils";
import {
  AccountResolver_Options,
  AccountResolver_TransactionsList, Env,
  Http_Module,
  Http_ResponseType,
  Args_getTransactions,
} from "../wrap";

export function getTransactions(args: Args_getTransactions, env: Env): AccountResolver_TransactionsList {
  const url = buildUrl([
    COVALENT_API,
    "v1",
    env.chainId.toString(),
    "address",
    args.accountAddress,
    "transactions_v2",
  ]);

  const params = getGlobalUrlParams(env.apiKey, env.vsCurrency, env.format);

  if (args.options) {
    const options = args.options as AccountResolver_Options;
    const paginationOptions = options.pagination;
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

    const blockRangeOptions = options.blockRange;
    if (blockRangeOptions) {
      const startBlockOption: string = blockRangeOptions.startBlock.isSome
        ? blockRangeOptions.startBlock.unwrap().toString()
        : "0";
      const endBlockOption: string = blockRangeOptions.endBlock.isSome
        ? blockRangeOptions.endBlock.unwrap().toString()
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
  }

  const res = Http_Module.get({
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
    updatedAt: getNullableStringProperty(jsonData, "updated_at"),
    nextUpdateAt: getNullableStringProperty(jsonData, "next_update_at"),
  };
}

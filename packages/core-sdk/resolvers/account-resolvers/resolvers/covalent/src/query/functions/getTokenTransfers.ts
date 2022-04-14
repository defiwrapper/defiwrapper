import { JSON } from "@web3api/wasm-as";

import { COVALENT_API, getTokenResolverQuery } from "../constants";
import {
  buildUrl,
  getNullableArrayProperty,
  getNullableObjectProperty,
  getStringProperty,
  parseJsonPagination,
  parseJsonTransfersPerTxns,
} from "../utils";
import {
  AccountResolver_TokenResolver_Token,
  AccountResolver_TransfersList,
  env,
  Http_Query,
  Http_ResponseType,
  Http_UrlParam,
  Input_getTokenTransfers,
  QueryEnv,
} from "../w3";

export function getTokenTransfers(input: Input_getTokenTransfers): AccountResolver_TransfersList {
  if (!env) throw new Error("env is not defined");

  const chainId = (env as QueryEnv).chainId.toString();
  const apiKey = (env as QueryEnv).apiKey;
  const url = buildUrl([COVALENT_API, "v1", chainId, "address", input.address, "transfers_v2"]);
  const tokenResolverQuery = getTokenResolverQuery(chainId);

  const token = tokenResolverQuery
    .getToken({ address: input.tokenAddress, m_type: "ERC20" })
    .unwrap();

  const params: Http_UrlParam[] = [
    {
      key: "key",
      value: apiKey,
    },
    {
      key: "contract-address",
      value: input.tokenAddress,
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

  const json = JSON.parse(response.body);
  if (!json || !json.isObj) throw new Error("Invalid response");

  const jsonData = (json as JSON.Obj).getObj("data");
  if (!jsonData || !jsonData.isObj) throw new Error("Invalid response body!");

  return {
    account: getStringProperty(jsonData, "address"),
    chainId: getStringProperty(jsonData, "chain_id"),
    quoteCurrency: getStringProperty(jsonData, "quote_currency"),
    token: changetype<AccountResolver_TokenResolver_Token>(token),
    transfers: parseJsonTransfersPerTxns(getNullableArrayProperty(jsonData, "items")),
    pagination: parseJsonPagination(getNullableObjectProperty(jsonData, "pagination")),
    updatedAt: getStringProperty(jsonData, "updated_at"),
    nextUpdateAt: getStringProperty(jsonData, "next_update_at"),
  };
}

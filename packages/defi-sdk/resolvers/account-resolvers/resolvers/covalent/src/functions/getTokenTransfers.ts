import { JSON } from "@polywrap/wasm-as";

import { COVALENT_API, getTokenResolverModule } from "../constants";
import {
  buildUrl,
  getGlobalUrlParams,
  getNullableArrayProperty,
  getNullableObjectProperty,
  getStringProperty,
  parseJsonPagination,
  parseJsonTransfersPerTxns,
} from "../utils";
import {
  AccountResolver_Options,
  AccountResolver_TokenResolver_Token,
  AccountResolver_TransfersList,
  Http_Module,
  Http_ResponseType,
  Args_getTokenTransfers, Env,
} from "../wrap";

export function getTokenTransfers(args: Args_getTokenTransfers, env: Env): AccountResolver_TransfersList {

  const url = buildUrl([
    COVALENT_API,
    "v1",
    env.chainId.toString(),
    "address",
    args.accountAddress,
    "transfers_v2",
  ]);
  const tokenResolverQuery = getTokenResolverModule(env.chainId.toString());

  const token = tokenResolverQuery
    .getToken({ address: args.tokenAddress, m_type: "ERC20" })
    .unwrap();

  const params = getGlobalUrlParams(env.apiKey, env.vsCurrency, env.format);
  params.push({
    key: "contract-address",
    value: args.tokenAddress,
  });

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

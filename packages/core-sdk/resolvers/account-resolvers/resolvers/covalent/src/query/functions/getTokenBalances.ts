import { JSON } from "@web3api/wasm-as";

import { COVALENT_API, getTokenResolverQuery } from "../constants";
import { buildUrl, getStringProperty } from "../utils";
import {
  AccountResolver_TokenBalance,
  AccountResolver_TokenResolver_Token,
  env,
  Http_Query,
  Http_ResponseType,
  Http_UrlParam,
  Input_getTokenBalances,
  QueryEnv,
} from "../w3";
import { AccountResolver_TokenBalancesList } from "../w3/imported/AccountResolver_TokenBalancesList";

export function getTokenBalances(input: Input_getTokenBalances): AccountResolver_TokenBalancesList {
  if (!env) throw new Error("env is not defined");

  const chainId = (env as QueryEnv).chainId.toString();
  const apiKey = (env as QueryEnv).apiKey;
  const url = buildUrl([
    COVALENT_API,
    "v1",
    chainId,
    "address",
    input.accountAddress,
    "balances_v2",
  ]);
  const tokenResolverQuery = getTokenResolverQuery(chainId);

  const params: Http_UrlParam[] = [
    {
      key: "key",
      value: apiKey,
    },
  ];

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

  const jsonItemsArr = jsonData.getArr("items");
  if (!jsonItemsArr || !jsonItemsArr.isArr) throw new Error("Invalid response body!");

  const tokenBalances: Array<AccountResolver_TokenBalance> = [];

  const items = jsonItemsArr.valueOf();

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as JSON.Obj;
    const address = getStringProperty(item, "contract_address");
    const balance = getStringProperty(item, "balance");

    const tokenResult = tokenResolverQuery.getToken({
      address: address,
      m_type: "ERC20",
    });

    if (tokenResult.isErr) {
      continue;
    }

    const token = tokenResult.unwrap();
    if (!token) continue;
    const tokenBalance: AccountResolver_TokenBalance = {
      token: changetype<AccountResolver_TokenResolver_Token>(token),
      balance: balance,
    };

    tokenBalances.push(tokenBalance);
  }

  return {
    account: getStringProperty(jsonData, "address"),
    chainId: getStringProperty(jsonData, "chain_id"),
    tokenBalances: tokenBalances,
  };
}

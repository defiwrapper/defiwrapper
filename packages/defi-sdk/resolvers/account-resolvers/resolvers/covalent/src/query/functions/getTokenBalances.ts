import { JSON } from "@web3api/wasm-as";

import { COVALENT_API, getTokenResolverQuery } from "../constants";
import { buildUrl, getGlobalUrlParams, getStringProperty, requireEnv } from "../utils";
import {
  AccountResolver_TokenBalance,
  AccountResolver_TokenResolver_Token,
  Http_Query,
  Http_ResponseType,
  Input_getTokenBalances,
} from "../w3";
import { AccountResolver_TokenBalancesList } from "../w3/imported/AccountResolver_TokenBalancesList";

export function getTokenBalances(input: Input_getTokenBalances): AccountResolver_TokenBalancesList {
  const env = requireEnv();

  const url = buildUrl([
    COVALENT_API,
    "v1",
    env.chainId.toString(),
    "address",
    input.accountAddress,
    "balances_v2",
  ]);
  const tokenResolverQuery = getTokenResolverQuery(env.chainId.toString());

  const params = getGlobalUrlParams(env.apiKey, env.vsCurrency, env.format);

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
      quote: getStringProperty(item, "quote"),
      quoteRate: getStringProperty(item, "quote_rate"),
    };

    tokenBalances.push(tokenBalance);
  }

  return {
    account: getStringProperty(jsonData, "address"),
    chainId: getStringProperty(jsonData, "chain_id"),
    tokenBalances: tokenBalances,
  };
}

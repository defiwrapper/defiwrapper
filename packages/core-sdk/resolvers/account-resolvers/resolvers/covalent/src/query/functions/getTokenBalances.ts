import { JSON } from "@web3api/wasm-as";

import { COVALENT_API } from "../configs";
import { buildUrl } from "../utils";
import {
  AccountResolver_Token,
  AccountResolver_TokenBalance,
  env,
  Http_Query,
  Http_ResponseType,
  Http_UrlParam,
  Input_getTokenBalances,
  QueryEnv,
  Token_Query,
  Token_TokenType,
} from "../w3";

export function getTokenBalances(
  input: Input_getTokenBalances,
): Array<AccountResolver_TokenBalance> {
  if (!env) throw new Error("env is not defined");

  const chainId = (env as QueryEnv).chainId.toString();
  const apiKey = (env as QueryEnv).apiKey;
  const url = buildUrl([COVALENT_API, "v1", chainId, "address", input.address, "balances_v2"]);

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
  if (!jsonItemsArr || !jsonItemsArr.isArr) return [];

  const tokenBalances: Array<AccountResolver_TokenBalance> = [];

  const items = jsonItemsArr.valueOf();

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as JSON.Obj;
    const address = item.getValue("contract_address");
    const balance = item.getValue("balance");

    if (!address || !balance) throw new Error("Invalid response body!");

    const tokenResult = Token_Query.getToken({
      address: address.toString(),
      m_type: Token_TokenType.ERC20,
    });

    if (tokenResult.isErr) {
      continue;
    }

    const token = tokenResult.unwrap();
    if (!token) continue;
    const tokenBalance: AccountResolver_TokenBalance = {
      token: changetype<AccountResolver_Token>(token),
      balance: balance.toString(),
      values: [],
    };

    tokenBalances.push(tokenBalance);
  }

  return tokenBalances;
}

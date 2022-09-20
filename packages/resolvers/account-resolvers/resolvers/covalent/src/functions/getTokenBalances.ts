import { BigNumber, JSON } from "@polywrap/wasm-as";

import { COVALENT_API, getTokenResolverModule } from "../constants";
import {
  buildUrl,
  getBigNumberProperty,
  getGlobalUrlParams,
  getNullableBigNumberProperty,
  getStringProperty,
} from "../utils";
import {
  AccountResolver_TokenBalance,
  AccountResolver_TokenBalancesList,
  AccountResolver_TokenResolver_Token,
  Args_getTokenBalances,
  Env,
  Http_Module,
  Http_ResponseType,
} from "../wrap";

export function getTokenBalances(
  args: Args_getTokenBalances,
  env: Env,
): AccountResolver_TokenBalancesList {
  const url = buildUrl([
    COVALENT_API,
    "v1",
    env.chainId.toString(),
    "address",
    args.accountAddress,
    "balances_v2",
  ]);

  const tokenResolverQuery = getTokenResolverModule(env.chainId.toString());

  const params = getGlobalUrlParams(env.apiKey, env.vsCurrency, env.format);

  const res = Http_Module.get({
    url: url,
    request: {
      headers: null,
      urlParams: params,
      responseType: Http_ResponseType.TEXT,
      body: null,
    },
  });
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
    const balance = getBigNumberProperty(item, "balance");

    const tokenResult = tokenResolverQuery.getToken({
      address: address,
      _type: "ERC20",
    });

    if (tokenResult.isErr) {
      continue;
    }

    const token = tokenResult.unwrap();
    if (!token) continue;
    const tokenBalance: AccountResolver_TokenBalance = {
      token: changetype<AccountResolver_TokenResolver_Token>(token),
      balance: balance.div(BigNumber.from(10).pow(token.decimals)),
      quote: getNullableBigNumberProperty(item, "quote"),
      quoteRate: getNullableBigNumberProperty(item, "quote_rate"),
    };

    tokenBalances.push(tokenBalance);
  }

  return {
    account: getStringProperty(jsonData, "address").toLowerCase(),
    chainId: getStringProperty(jsonData, "chain_id"),
    tokenBalances: tokenBalances,
  };
}

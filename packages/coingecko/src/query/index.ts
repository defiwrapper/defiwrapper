import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "./config";
import { HTTP_Query, HTTP_ResponseType, Ping, CoinsList, Input_coinsList } from "./w3";

export function ping(): Ping {
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/ping",
    request: {
      headers: [],
      urlParams: [],
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  });
  if (!response || response.status !== 200 || !response.body) {
    throw Error(response.statusText);
  }

  const json = <JSON.Obj>JSON.parse(response.body);
  const geckoSays = json.getString("gecko_says");
  if (geckoSays) {
    return {
      gecko_says: geckoSays.valueOf(),
    };
  }
  throw Error(response.statusText);
}

export function supportedVSCurrencies(): Array<string> {
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/simple/supported_vs_currencies",
    request: {
      headers: [],
      urlParams: [],
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  });
  if (!response || response.status !== 200 || !response.body) {
    throw Error(response.statusText);
  }

  const jsonArray = <JSON.Arr>JSON.parse(response.body);

  if (!jsonArray) {
    throw Error(response.statusText);
  }
  const valueArr = jsonArray.valueOf();
  return valueArr.map<string>((value) => value.toString());
}

export function coinsList(Input: Input_coinsList): Array<CoinsList> {
  const inputs = Input.include_platform
    ? `coins/list?include_platform=true`
    : `coins/list?include_platform=false`;
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + inputs,
    request: {
      headers: [],
      urlParams: [],
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  });

  if (!response || response.status !== 200 || !response.body) {
    throw Error(response.statusText);
  }

  const jsonArray = <JSON.Arr>JSON.parse(response.body);
  if (!jsonArray) {
    throw Error(response.statusText);
  }
  const valueArr = jsonArray.valueOf();

  return valueArr.map<CoinsList>((elem) => {
    if (elem.isObj) {
      const coinObj = elem as JSON.Obj;
      return {
        id: (coinObj.getString("id") as JSON.Str).toString(),
        symbol: (coinObj.getString("symbol") as JSON.Str).toString(),
        name: (coinObj.getString("name") as JSON.Str).toString(),
      } as CoinsList;
    }
    throw new Error(" Array elemeent is not an object");
  });
}

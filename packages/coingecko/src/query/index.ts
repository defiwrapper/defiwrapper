import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "./config";
import { HTTP_Query, HTTP_ResponseType, Ping, coinsMarkets, Input_coinsList } from "./w3";

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


export function coinsMarkets(): Array<coinsMarkets> {


  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/coins/markets?vs_currency=usd",
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

  return valueArr.map<coinsMarkets>((elem) => {
    if (elem.isObj) {
      const coinObj = elem as JSON.Obj;
      return {
        id: (coinObj.getString("id") as JSON.Str).toString(),
        symbol: (coinObj.getString("symbol") as JSON.Str).toString(),
        name: (coinObj.getString("name") as JSON.Str).toString(),
      } as coinsMarkets;
    }
    throw new Error(" Array elemeent is not an object");
  });
}

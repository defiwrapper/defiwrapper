import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "./config";
import { HTTP_Query, HTTP_ResponseType, Ping, CoinsList } from "./w3";

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

export function coinsList(): Array<String>{
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/coins/list",
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
  return valueArr.map<string>((value) => value.toString().replace('\"',''));

  /*
  return valueArr.map<CoinsList> ( (elem) => {
    if(elem.isObj){
      const coinObj = <JSON.Obj>JSON.parse(elem)
      return {
        id: coinObj.getString("id").toString(),
        symbol: coinObj.getString('symbol').toString(),
        name: coinObj.getString('name').toString()

      } as CoinsList
    }
    throw new Error(" Array elemeent is not an object")
  })
  */
}

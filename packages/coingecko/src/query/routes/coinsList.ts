import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { getStringProperty } from "../utils";
import { CoinsList, HTTP_Query, HTTP_ResponseType, HTTP_UrlParam, Input_coinsList } from "../w3";

export function coinsList(input: Input_coinsList): Array<CoinsList> {
  const urlParams: Array<HTTP_UrlParam> = [
    { key: "include_platform", value: `${input.include_platform.value}` },
  ];

  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/coins/list",
    request: {
      headers: [],
      urlParams: urlParams,
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  });

  if (!response || response.status !== 200 || !response.body) {
    const errorMsg =
      response && response.statusText
        ? (response.statusText as string)
        : "An error occurred while fetching data from Coingecko API";
    throw new Error(errorMsg);
  }

  const jsonArray = <JSON.Arr>JSON.parse(response.body);
  if (!jsonArray) {
    const message: string = response.body ? (response.body as string) : "";
    throw new Error("Invalid response: " + message);
  }
  const valueArr = jsonArray.valueOf();
  const coinsListArr: CoinsList[] = [];

  for (let i = 0; i < valueArr.length; i++) {
    const elem = valueArr[i];
    if (!elem.isObj) {
      const message: string = response.body ? (response.body as string) : "";
      throw new Error("Invalid response: " + message);
    }
    const coinObj = elem as JSON.Obj;
    coinsListArr.push({
      id: getStringProperty(coinObj, "id"),
      symbol: getStringProperty(coinObj, "symbol"),
      name: getStringProperty(coinObj, "name"),
    });
  }

  return coinsListArr;
}

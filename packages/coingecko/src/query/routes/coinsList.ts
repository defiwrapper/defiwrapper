import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { HTTP_Query, HTTP_ResponseType, CoinsList, Input_coinsList, HTTP_UrlParam } from "../w3";

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
    throw new Error(" Array element is not an object");
  });
}

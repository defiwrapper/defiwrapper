import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { boolToString } from "../utils";
import {
  HTTP_Query,
  HTTP_ResponseType,
  CoinsMarkets,
  Roi,
  HTTP_UrlParam,
  Input_coinsMarkets,
} from "../w3";

export function coinsMarkets(input: Input_coinsMarkets): Array<CoinsMarkets> {
  const urlParamsa: Array<HTTP_UrlParam> = [
    { key: "vs_currency", value: input.vs_currency },
    { key: "id", value: input.id ? (input.id as string) : "" },
    { key: "category", value: input.category ? (input.category as string) : "" },
    { key: "order", value: input.order ? (input.order as string) : "" },
    {
      key: "per_page",
      value: input.per_page.isNull ? "" : (input.per_page.value as i32).toString(),
    },
    { key: "page", value: input.page.isNull ? "" : (input.page.value as i32).toString() },
    { key: "sparkline", value: boolToString(input.sparkline) },
    {
      key: "price_change_percentage",
      value: input.price_change_percentage
        ? (input.price_change_percentage as string[]).join(",")
        : "",
    },
  ];

  const urlParams: Array<HTTP_UrlParam> = [{ key: "vs_currency", value: input.vs_currency }];

  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/coins/markets",
    request: {
      headers: [],
      urlParams: urlParamsa.filter((elem) => !!elem.value),
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

  return valueArr.map<CoinsMarkets>((elem) => {
    if (elem.isObj) {
      const coinObj = elem as JSON.Obj;
      const roiObj = coinObj.getObj("roi");
      let roia: Roi | null = null;
      if (roiObj) {
        roia = {
          times: (roiObj.getValue("times") as JSON.Value).toString(),
          currency: (roiObj.getValue("currency") as JSON.Value).toString(),
          percentage: (roiObj.getValue("percentage") as JSON.Value).toString(),
        };
      }
      return {
        id: (coinObj.getString("id") as JSON.Str).toString(),
        symbol: (coinObj.getString("symbol") as JSON.Str).toString(),
        name: (coinObj.getString("name") as JSON.Str).toString(),
        image: (coinObj.getString("image") as JSON.Str).toString(),
        current_price: (coinObj.getValue("current_price") as JSON.Value).toString(),
        market_cap: (coinObj.getInteger("market_cap") as JSON.Integer).toString(),
        market_cap_rank: (coinObj.getInteger("market_cap_rank") as JSON.Integer).toString(),
        fully_diluted_valuation: (
          coinObj.getValue("fully_diluted_valuation") as JSON.Value
        ).toString(),
        total_volume: (coinObj.getValue("total_volume") as JSON.Value).toString(),
        high_24h: (coinObj.getValue("high_24h") as JSON.Value).toString(),
        low_24h: (coinObj.getValue("low_24h") as JSON.Value).toString(),
        price_change_24h: (coinObj.getValue("price_change_24h") as JSON.Value).toString(),
        price_change_percentage_24h: (
          coinObj.getValue("price_change_percentage_24h") as JSON.Value
        ).toString(),
        market_cap_change_24h: (coinObj.getValue("market_cap_change_24h") as JSON.Value).toString(),
        market_cap_change_percentage_24h: (
          coinObj.getValue("market_cap_change_percentage_24h") as JSON.Value
        ).toString(),
        circulating_supply: (coinObj.getValue("circulating_supply") as JSON.Value).toString(),
        total_supply: (coinObj.getValue("total_supply") as JSON.Value).toString(),
        max_supply: (coinObj.getValue("max_supply") as JSON.Value).toString(),
        ath: (coinObj.getValue("ath") as JSON.Value).toString(),
        ath_change_percentage: (coinObj.getValue("ath_change_percentage") as JSON.Value).toString(),
        ath_date: (coinObj.getValue("ath_date") as JSON.Value).toString(),
        atl: (coinObj.getValue("atl") as JSON.Value).toString(),
        atl_change_percentage: (coinObj.getValue("atl_change_percentage") as JSON.Value).toString(),
        atl_date: (coinObj.getString("atl_date") as JSON.Str).toString(),
        roi: roia,
        last_updated: (coinObj.getString("last_updated") as JSON.Str).toString(),
      } as CoinsMarkets;
    }
    throw new Error(" Array elemeent is not an object");
  });
}

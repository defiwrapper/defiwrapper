import { JSON } from "@web3api/assemblyscript-json";
import { COINGECKO_API_URL } from "../config";
import {
  normalizeTimestampMarketCapPairArray,
  normalizeTimestampPricePairArray,
  normalizeTimestampVolumePairArray,
} from "../utils";
import {
  CoinMarketChartRange,
  HTTP_Query,
  HTTP_ResponseType,
  HTTP_UrlParam,
  Input_coinMarketChartRange,
} from "../w3";

export function coinMarketChartRange(input: Input_coinMarketChartRange): CoinMarketChartRange {
  const url = COINGECKO_API_URL + "/coins/" + input.id + "/market_chart/range";

  const urlParams: Array<HTTP_UrlParam> = [
    { key: "vs_currency", value: input.vs_currency },
    { key: "from", value: input.from.toString() },
    { key: "to", value: input.to.toString() },
  ];

  const response = HTTP_Query.get({
    url,
    request: {
      headers: [],
      urlParams,
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  });

  if (!response || response.status !== 200 || !response.body) {
    throw new Error(response ? response.statusText : "response should be defined");
  }

  const obj = <JSON.Obj>JSON.parse(response.body);

  // prices
  const pricesArray = obj.getArr("prices");
  if (pricesArray === null) {
    throw new Error("error in response: prices should be an array");
  }

  // market_capstotalVolumeItem._arr[0] as JSON.Integer
  const marketCapsArray = obj.getArr("market_caps");
  if (marketCapsArray === null) {
    throw new Error("error in response: market_caps should be an array");
  }

  // total_volumes
  const totalVolumesArray = obj.getArr("total_volumes");
  if (totalVolumesArray === null) {
    throw new Error("error in response: total_volumes should be an array");
  }

  return {
    prices: normalizeTimestampPricePairArray(pricesArray),
    market_caps: normalizeTimestampMarketCapPairArray(marketCapsArray),
    total_volumes: normalizeTimestampVolumePairArray(totalVolumesArray),
  };
}

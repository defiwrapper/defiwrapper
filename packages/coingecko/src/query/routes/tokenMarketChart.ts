import { JSON } from "@web3api/assemblyscript-json";
import { BigInt } from "as-bigint";
import { COINGECKO_API_URL } from "../config";
import {
  HTTP_Query,
  HTTP_ResponseType,
  HTTP_UrlParam,
  Input_tokenMarketChart,
  TimestampMarketCapPair,
  TimestampPricePair,
  TimestampVolumePair,
  TokenMarketChart,
} from "../w3";

export function tokenMarketChart(input: Input_tokenMarketChart): TokenMarketChart {
  const url =
    COINGECKO_API_URL +
    "/coins/" +
    input.id +
    "/contract/" +
    input.contract_address +
    "/market_chart";

  const urlParams: Array<HTTP_UrlParam> = [
    { key: "vs_currency", value: input.vs_currency },
    { key: "days", value: input.days.toString() },
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
    throw Error(response.statusText);
  }

  const obj = <JSON.Obj>JSON.parse(response.body);

  // prices
  const pricesArray = obj.getArr("prices");
  if (pricesArray === null) {
    throw new Error("error in response: prices should be an array");
  }

  const prices = pricesArray._arr.map<TimestampPricePair>((item) => {
    const priceItem = item as JSON.Arr;
    return {
      timestamp: BigInt.fromString(priceItem._arr[0].toString()),
      price: priceItem._arr[1].toString(),
    };
  });

  // market_capstotalVolumeItem._arr[0] as JSON.Integer
  const marketCapsArray = obj.getArr("market_caps");
  if (marketCapsArray === null) {
    throw new Error("error in response: market_caps should be an array");
  }

  const marketCaps = marketCapsArray._arr.map<TimestampMarketCapPair>((item) => {
    const marketCapItem = item as JSON.Arr;
    return {
      timestamp: BigInt.fromString(marketCapItem._arr[0].toString()),
      market_cap: marketCapItem._arr[1].toString(),
    };
  });

  // total_volumes
  const totalVolumesArray = obj.getArr("total_volumes");
  if (totalVolumesArray === null) {
    throw new Error("error in response: total_volumes should not be an array");
  }

  const totalVolumes = totalVolumesArray._arr.map<TimestampVolumePair>((item) => {
    const totalVolumeItem = item as JSON.Arr;
    return {
      timestamp: BigInt.fromString(totalVolumeItem._arr[0].toString()),
      volume: totalVolumeItem._arr[1].toString(),
    };
  });

  return {
    prices,
    market_caps: marketCaps,
    total_volumes: totalVolumes,
  };
}

import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { getStringProperty } from "../utils";
import {
  HTTP_Query,
  HTTP_ResponseType,
  Global,
  GlobalData,
  TotalMarketCap,
  TotalVolume,
  MarketCapPercentage,
} from "../w3";

export function global(): Global {
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/global",
    request: {
      headers: [],
      urlParams: [],
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

  const json = <JSON.Obj>JSON.parse(response.body);
  const active_cryptocurrencies = getStringProperty(json, "active_cryptocurrencies").toString();
  const upcoming_icos = getStringProperty(json, "upcoming_icos").toString();
  const ongoing_icos = getStringProperty(json, "ongoing_icos").toString();
  const ended_icos = getStringProperty(json, "ended_icos").toString();
  const markets = getStringProperty(json, "markets").toString();
  const market_cap_change_24h_in_currency = getStringProperty(
    json,
    "market_cap_change_24h_in_currency",
  ).toString();
  const last_updated = getStringProperty(json, "last_updated").toString();

  // const totalMarketCapKeys: string[] = json.keys["data"].keys["total_market_cap"];
  // const totalVolumeKeys = json.keys["data"].keys["total_volume"];
  // const marketCapPercentageKeys = json.keys["data"].keys["market_cap_percentage"];
  const totalMarketCapKeys: string[] = json.keys;
  const totalVolumeKeys = json.keys;
  const marketCapPercentageKeys = json.keys;

  const total_market_cap: TotalMarketCap[] = [];
  const total_volume: TotalVolume[] = [];
  const market_cap_percentage: MarketCapPercentage[] = [];

  for (let i = 0; i < totalMarketCapKeys.length; i++) {
    const marketCap = {
      currency: totalMarketCapKeys[i],
      market_cap: json["total_market_cap"][totalMarketCapKeys[i]],
    };
    total_market_cap.push(marketCap);
  }

  for (let i = 0; i < totalVolumeKeys.length; i++) {
    const volume = {
      currency: totalVolumeKeys[i],
      market_cap: json["total_volume"][totalVolumeKeys[i]],
    };
    total_market_cap.push(volume);
  }

  for (let i = 0; i < marketCapPercentageKeys.length; i++) {
    const marketCapPercentage = {
      currency: marketCapPercentageKeys[i],
      market_cap: json["market_cap_percentage"][marketCapPercentageKeys[i]],
    };
    total_market_cap.push(marketCapPercentage);
  }

  const globalData: GlobalData = {
    active_cryptocurrencies,
    upcoming_icos,
    ongoing_icos,
    ended_icos,
    markets,
    total_market_cap,
    total_volume,
    market_cap_percentage,
    market_cap_change_24h_in_currency,
    last_updated,
  };

  return { data: globalData };
}

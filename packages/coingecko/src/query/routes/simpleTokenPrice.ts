import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { boolToString, getNullableIntegerProperty, getNullableStringProperty } from "../utils";
import {
  HTTP_Query,
  HTTP_ResponseType,
  HTTP_UrlParam,
  Input_simpleTokenPrice,
  SimplePriceData,
  SimpleTokenPrice,
} from "../w3";

export function simpleTokenPrice(input: Input_simpleTokenPrice): SimpleTokenPrice[] {
  const urlParams: Array<HTTP_UrlParam> = [
    { key: "contract_addresses", value: input.contract_addresses.join(",") },
    { key: "vs_currencies", value: input.vs_currencies.join(",") },
    { key: "include_market_cap", value: boolToString(input.include_market_cap) },
    { key: "include_24hr_vol", value: boolToString(input.include_24hr_vol) },
    { key: "include_24hr_change", value: boolToString(input.include_24hr_change) },
    { key: "include_last_updated_at", value: boolToString(input.include_last_updated_at) },
  ];

  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/simple/token_price/" + input.id,
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

  const contract_addresses = input.contract_addresses;
  const vs_currencies = input.vs_currencies;

  const json = <JSON.Obj>JSON.parse(response.body);
  const simplePrices: SimpleTokenPrice[] = [];
  for (let i = 0; i < contract_addresses.length; i++) {
    const rawPriceData = json.getObj(contract_addresses[i]);
    if (rawPriceData) {
      const priceDatas: SimplePriceData[] = [];
      for (let j = 0; j < vs_currencies.length; j++) {
        const currency = vs_currencies[j];
        const price = getNullableStringProperty(rawPriceData, currency);
        if (price) {
          const market_cap = getNullableStringProperty(rawPriceData, currency + "_market_cap");
          const vol_24h = getNullableStringProperty(rawPriceData, currency + "_24h_vol");
          const change_24h = getNullableStringProperty(rawPriceData, currency + "_24h_change");
          priceDatas.push({
            vs_currency: currency,
            price: price,
            market_cap: market_cap,
            vol_24h: vol_24h,
            change_24h: change_24h,
          });
        }
      }
      const last_updated_at = getNullableStringProperty(rawPriceData, "last_updated_at");
      simplePrices.push({
        contract_address: contract_addresses[i],
        price_data: priceDatas,
        last_updated_at: last_updated_at,
      });
    }
  }
  return simplePrices;
}

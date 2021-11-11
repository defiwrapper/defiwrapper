import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { HTTP_Query, HTTP_ResponseType, CoinsMarkets } from "../w3";



export function coinsMarkets(): Array<CoinsMarkets> {


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
  
    return valueArr.map<CoinsMarkets>((elem) => {
      if (elem.isObj) {
        const coinObj = elem as JSON.Obj;
        return {
          id: (coinObj.getString("id") as JSON.Str).toString(),
          symbol: (coinObj.getString("symbol") as JSON.Str).toString(),
          name: (coinObj.getString("name") as JSON.Str).toString(),
          image: (coinObj.getString("image") as JSON.Str).toString(),
          //current_price: Float!
          market_cap: parseInt((coinObj.getString("market_cap") as JSON.Str).toString()) as i32,
          //market_cap_rank: Int!
          //fully_diluted_valuation: Int!
          //total_volume: Int!
          //high_24h: Int!
          //low_24h: Int!
          //price_change_24h: Float!
          //price_change_percentage_24h: Float!
          //market_cap_change_24h: Float!
          //market_cap_change_percentage_24h: Float!
          //circulating_supply: Int!
          //total_supply: Int!
          //max_supply: Int!
          //ath: Int!
          //ath_change_percentage: Float!
          ath_date: (coinObj.getString("ath_date") as JSON.Str).toString(),
          //atl: coinObj.getString("ath_date") as JSON.Float,
          //atl_change_percentage: Float!
          atl_date: (coinObj.getString("atl_date") as JSON.Str).toString(),
          //roi: Roi
          last_updated: (coinObj.getString("last_updated") as JSON.Str).toString()

        } as CoinsMarkets;
      }
      throw new Error(" Array elemeent is not an object");
    });
  }
  

import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { HTTP_Query, HTTP_ResponseType} from "../w3";


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
  
import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { HTTP_Query, HTTP_ResponseType } from "../w3";

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
  return valueArr.map<string>((value) => value.toString());
}

import { COINGECKO_API_URL } from "./config";
import { HTTP_Query, Ping, HTTP_ResponseType } from "./w3";
import { JSON } from "assemblyscript-json";

export function ping(): Ping {
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/ping",
    request: {
      headers: [],
      urlParams: [],
      body: "",
      responseType: HTTP_ResponseType.TEXT
    }
  })
  if (!response || response.status !== 200 || !response.body) {
    throw Error(response.statusText);
  }

  const json = <JSON.Obj>JSON.parse(response.body);
  const geckoSays = json.getString("gecko_says")
  if (geckoSays) {
    return {
      gecko_says: geckoSays.valueOf()
    }
  } 
  throw Error(response.statusText);
} 

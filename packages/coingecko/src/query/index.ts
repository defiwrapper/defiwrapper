import { COINGECKO_API_URL } from "./config";
import { HTTP_Query, Ping, HTTP_ResponseType } from "./w3";
// import { JSON } from "assemblyscript-json";

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
  // if (!response) {
  //   throw Error(response.statusText);
  // }
  return {
    GeckoSays: "Hi"
  }
//   const status: i32 = response.status;
//   if (status === 200) {
//     const json = <JSON.Obj>JSON.parse(response.body);
//     const geckoSays = json.getString("GeckoSays")
//     if (geckoSays) {
//       return {
//         GeckoSays: geckoSays.valueOf()
//       }
//     }
//   }
//   throw Error(response.statusText);
} 

import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "./config";
import { HTTP_Query, HTTP_ResponseType, Ping} from "./w3"; 

export function ping(): Ping {
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/ping",
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

  const json = <JSON.Obj>JSON.parse(response.body);
  const geckoSays = json.getString("gecko_says");
  if (geckoSays) {
    return {
      gecko_says: geckoSays.valueOf(),
    };
  }
  throw Error(response.statusText);
}

export function supportedVSCurrencies(): Array<string>{
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
  const body = response.body
  if (body){ 
    const res: string = body as string
    const lengthRes = res.length
    
    if(lengthRes > 4){
      const letra = res.substring(2,lengthRes - 2)
      const letrArray = letra.split('\",\"')
      return letrArray
      
    }return []
    
  }
  else {throw Error("...")}

} 

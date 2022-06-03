import { HTTP_Query, HTTP_Response, HTTP_ResponseType } from "../w3/imported";

let last = 0;
let counter = 0;

function queryRandom(): HTTP_Response | null {
  return HTTP_Query.get({
    url: "https://random-data-api.com/api/id_number/random_id_number",
    request: {
      headers: null,
      body: null,
      urlParams: null,
      responseType: HTTP_ResponseType.TEXT,
    },
  }).unwrap();
}

export function randint(): i32 {
  if (counter % 3 === 0) {
    const response: HTTP_Response | null = queryRandom();
    if (response === null) return 7;
    if (!response.body) return 0;
    last = I32.parseInt((response.body as string).split(",")[0].slice(6));
  } else {
    last += counter + 1327;
    counter++;
  }
  return last;
}

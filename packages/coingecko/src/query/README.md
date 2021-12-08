# How to add a new endpoint from coingecko API to the coingecko polywrapper?

In order to add a new endpoint to the coingecko polywrapper, one must add a function in [Coingecko GraphQL schema](./schema.graphql) under `Query` type with all the necessary parameters and a return type.

You can get the list of parameters from the Coingecko API [documentation](https://www.coingecko.com/en/api/documentation) or if you prefer in swagger [JSON format](https://www.coingecko.com/api/documentations/v3/swagger.json)

You can get Return type of the function by querying API endpoint directly with different parameter and analysing the returned JSON object. Assign correct type for each field in this JSON object. In case of doubt you can always reach out to us on Discord. Once you have concrete return type object for that particular function, you can store it in the [commons GraphQL schema](../commons/schema.graphql) and import it in  [Coingecko GraphQL schema](./schema.graphql) just like we did with `ping`. 

Once you have input and output data schema of the function fixed, you need to actually implement the function in the `assemblyscript` which is very similar to `typescript` but with few restriction. You can checkout our implementation for ping function.

```ts
import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import { HTTP_Query, HTTP_ResponseType, Ping } from "../w3";

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
    const errorMsg =
      response && response.statusText
        ? (response.statusText as string)
        : "An error occurred while fetching data from Coingecko API";
    throw new Error(errorMsg);
  }

  const json = <JSON.Obj>JSON.parse(response.body);
  const geckoSays = json.getString("gecko_says");
  if (geckoSays) {
    return {
      gecko_says: geckoSays.valueOf(),
    };
  }
  throw new Error("Invalid response body!");
}
```

Once you are done with implementing the function, you can manually test it by writing a recipe in `recipes`. You need to add new `query` in a new schema file just like we write [schema.graphql](../../recipes/endpoints/ping/schema.graphql) schema file for ping function. After that, you need to add an entry in [e2e.json](../../recipes/endpoints/ping/e2e.json) with the corresponding schema file and the parameters with which you want to call the function. 

To run the test, you first need to build the function if you haven't done so already,
```console
yarn build
```

You can now test the function by simply starting test-env with:
```console
yarn test:env:up
```

and then you need to deploy the function with
```console
yarn deploy
```

Once deployed to the `testnet`, you can test it by running recipes with following commands:
```console
yarn recipes
```
If you want to run a specific recipe Ex: `ping` from coingecko polywrapper, you can do so by running
```console
yarn recipes ping
``` 
To run automated tests, you need to create a new test in `src/__tests__/integration.spec.ts` file with jest framework.
You can run these e2e tests with following command or using Jest Runner extension in VS Code.
```console
yarn test
```
> Note: Make sure you aren't running test-env before running e2e tests, if you are already running it then you can turn it down by running `yarn test:env:down`
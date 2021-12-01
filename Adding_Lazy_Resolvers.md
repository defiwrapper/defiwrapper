# How to add a Lazy Resolver:

The lazy resolvers are simple ways to identifying new protocols, as well as and assigning supported [adapters]() (for protocols like uniswap, aave, yearn, etc) on new [EVM networks](). 

The term ***"Lazy"*** comes from the fact that we aren't using protocol registry to validate whether a given token is actually a protocol token of the particular protocol but instead using token metadata to lazily predict whether token belongs to a protocol

> *Essentially lazy adapters increase the reach of protocols covered by the Defiwrapper.*

## Prerequisites:
- [Join our Discord community](https://discord.gg/23BwdKf3Zr) and we'll help you debug if you need any help or find blockers.
- `nvm` to avoid node version errors
- You need to be running `Docker` on your machine to build the wrappers
- what else?

## Adding a Lazy resolver, step-by-step:
1. To begin, read Defiwrapper's [CONTRIBUTING.MD]()
2. Fork the main Defiwrapper repository and clone your own fork into your machine.
3. Find the `chainID` of the network you'll be querying. You can use a service like [chainlist.org](https://chainlist.org/) to find the chainID. *For example, Avalanche Mainnet's `chainID` is `43114`*
4. In the [query/networks/tokenTypes.ts](./packages/defi-sdk/query/networks/tokenTypes.ts) file, include the network `chainID` like so :
```ts

TODO: fix code snippet to work with chainID
vvvvvvv

import { Ethereum_Connection, Ethereum_Query, Token, TokenProtocolType } from "../w3";
import { getTokenType as getMainnetTokenType } from "./mainnet/tokenTypes";
import { getTokenType as getPolygonTokenType } from "./polygon/tokenTypes";
// Import the new token types you've created, like so
import { getTokenType as getAvalancheTokenType } from "./avalanche/tokenTypes";


export function getTokenType(token: Token, connection: Ethereum_Connection): TokenProtocolType {
  const network = Ethereum_Query.getNetwork({ connection: connection });
  switch (network.chainId) {
    case 1:
      return getMainnetTokenType(token);
    case 137:
      return getPolygonTokenType(token);
    // Add a case for your chainID, like so
    case 43114:
      return getAvalancheTokenType(token);
    default:
      throw Error("chainId: " + network.chainId.toString() + " isn't currently supported!");
  }
}
```

3. Duplicate folder in the [src/query/networks/polygon/]() directory, and give it the name of the network you're creating the Lazy Resolver for. 

    *For this example we're including Avalanche Mainnet, and duplicating the `src/query/networks/polygon/` directory, and renaming it to `src/query/networks/avalanche/`.*
5. Open your duplicate token types file at `src/query/networks/avalanche/tokenTypes.ts`, and analyse the tokens you want to include in the lazy resolver. Remember that [there must be already an adapter for it](./packages/defi-sdk/src/query/adapters).
7. Start detailing conditions on the token, by using metadata like token name or symbol.  you can use a certain adapter.

```ts
import { Token } from "../../w3";
import { TokenProtocolType } from "../../w3";

export function getTokenType(token: Token): TokenProtocolType {
  if (token.name.startsWith("Curve ") && token.name.endsWith(" Gauge Deposit")) {
    return TokenProtocolType.CurveGauge;
  } else if (token.name.startsWith("Curve.fi ")) {
    return TokenProtocolType.Curve;
  } else if (token.name.startsWith("Aave Avalanche Market ")) {
    return TokenProtocolType.AaveV2;
  } else if (token.symbol == "UNI-V2") {
    return TokenProtocolType.UniswapV2;
  } else if (token.name == "SushiSwap LP Token") {
    return TokenProtocolType.Sushiswap;
  } else if (token.name == "SushiBar") {
    return TokenProtocolType.Sushibar;
  } else {
    return TokenProtocolType.Native;
  }
}

```
6. Edit the existing recipe script to test the integration, by adding a token that you can verify. *For example, to test if Aave tokens are correctly processed on Avalanche, we'll look for the token data:*
   - Token name: `Aave Avalanche Market DAI`
   - Token symbol: `avDAI`
   - Token address: `0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a`*.

    And edit the [./packages/defi-sdk/recipes/adapters/aave/e2e.json](./packages/defi-sdk/recipes/adapters/aave/e2e.json) to include the token you're testing:
    

    ```json
    TODO fix recipesso that they use `chainID`
    {
    "query": "./polygon.graphql",
    "variables": {
      "address": "0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a",
      "node": "https://polygon-rpc.com/"
    }
    ``` 
    
    You can do the same with the other protocols in that same network for which there is an adapter already built, like "Sushiswap" and "Curve.fi", both are in Avalanche Network, and have existing [adapters](./packages/defi-sdk/recipes/adapters/).


## To test your integration
`nvm`
`yarn`
`yarn build`
`yarn deploy`
`yarn recipes aave` <- explain how to avoid long waits and selecting specific recipes to test, instead of all recipes


### **The output should include the underlying tokens:**
A **failed** integration won't have data on the `underlyingTokenComponents`
![](https://i.imgur.com/anxtAdm.png)

While a **succesful** integration will show the underlaying token components like so:
![](https://i.imgur.com/anxtAdm.png) <-- TODO  fix screenshot

### Testing with Jest
Devs can now write integration test in jest for automated testing 
- Aave mainnet example: https://github.com/Niraj-Kamdar/defiwrapper/blob/main/packages/defi-sdk/src/__tests__/e2e/mainnet.spec.ts#L51
- Aave polygon example: https://github.com/Niraj-Kamdar/defiwrapper/blob/main/packages/defi-sdk/src/__tests__/e2e/polygon.spec.ts#L51


## Submitting your integration

Once your integration is working, please open a PR against the main Defiwrapper repository. Succesful integrations may qualify for a reward. 
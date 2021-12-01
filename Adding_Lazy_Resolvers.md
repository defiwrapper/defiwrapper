# How to add a Lazy Resolver:

The lazy resolvers are simple ways to identifying new protocols, as well as and identifying supported [adapters]() (for protocols like uniswap, aave, yearn, etc) on new [EVM networks](). 

The term ***"Lazy"*** comes from the fact that we aren't using protocol registry to validate whether a given token is actually a protocol token of the particular token but instead using token metadata to lazily predict whether token belongs to a protocol

> *Essentially lazy adapters increase the reach of protocols covered by the Defiwrapper.*

## Prerequisites:
- You need to be running `Docker` on your machine to build the wrappers
- `nvm` to avoid node version errors
- ?

## Adding the 
1. To begin, read [CONTRIBUTING.MD]()
2. Create a folder in the [src/query/networks/]() directory, and name it accordingly. *For this example we're including Avalanche Mainnet.*
3. Find the `chainID` of the network you'll be querying. You can use a service like [chainlist.org](https://chainlist.org/) to find the chainID. *For example, Avalanche Mainnet's `chainID` is `43114`*
4. In the parent directory, on the [query/networks/tokenTypes.ts](./packages/defi-sdk/query/networks/tokenTypes.ts) file, include the network `chainID` like so :
```ts

TODO: fix code snippet to work with chainID
vvvvvvv

import { Ethereum_Connection, Token, TokenProtocolType } from "../w3";
import { getTokenType as getMainnetTokenType } from "./mainnet/tokenTypes";
import { getTokenType as getPolygonTokenType } from "./polygon/tokenTypes";
import { getTokenType as getAvalancheTokenType } from "./avalanche/tokenTypes";

export function getTokenType(token: Token, connection: Ethereum_Connection): TokenProtocolType {
  // TODO: plugin should have a way to fetch chainID from connection object
  if (connection.networkNameOrChainId == "MAINNET") {
    return getMainnetTokenType(token);
  } else if (connection.node == "https://api.avax.network/ext/bc/C/rpc") {
    return getPolygonTokenType(token);
  } else if (connection.node == "<avax-rpc>") {
    return getAvalancheTokenType(token);
  }
}
```
4. Analyse the protocols you want to include, and write the "lazy" logic into the [network's query schema](). By specifying conditions on the token (using it's token name or symbol for example) you can use a certain adapter.

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

    And edit the recipes.json

```

```


To test
`nvm`
`yarn`
`yarn build`
`yarn deploy`
`yarn recipes aave` <- explain how to avoid long waits and selecting specific recipes to test, instead of all recipes
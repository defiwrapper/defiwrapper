How to add a Lazy Resolver:

The lazy resolvers are simple ways to add pre-existing supported [adapters]() (for protocols like uniswap, aave, yearn) to new [EVM networks](). This way we can increase the reach of protocols covered by the Defiwrapper

0. To begin, read [CONTRIBUTING.MD]()
1. Create a query schema in the [query/networks/] folder, and name it accordingly. ()
2. Find the RPC of the network you'll be querying; (i.e. For example, Avalanche's RPC is `https://api.avax.network/ext/bc/C/rpc`)
3. Include the network RPC on the [query/networks/tokenTypes.ts] file,like so :
```ts
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
5. Create a recipe script against a token that you can verify (For example, Aave Avalanche Market DAI (avDAI) is `0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a`)
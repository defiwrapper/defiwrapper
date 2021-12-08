# How to add an adapter?

The adapters are a simple module for a particular protocol that takes protocol token and optionally a version as an argument and returns underlying components and its proportion with respect to the protocol token

Ex: Sushibar adapter takes `xSUSHI` as an argument and returns rate of conversion of `xSUSHI` into `SUSHI`.
```json
{
  "getComponents": {
    "token": {
      "address": "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
      "name": "SushiBar",
      "symbol": "xSUSHI",
      "decimals": 18,
      "totalSupply": "68828762817907898982295808"
    },
    "underlyingTokenComponents": [
      {
        "token": {
          "address": "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
          "name": "SushiToken",
          "symbol": "SUSHI",
          "decimals": 18,
          "totalSupply": "232539564055938576031638126"
        },
        "rate": "1.17693294712155593234",
        "type": 0
      }
    ]
  }
}
```

Every adapters must implement `getComponents` function. Let's see an example of how to create an adapter.

### 1. Imports 

First of all, you need to import all the necessary modules.
```typescript
import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big/Big";

import { getTokenType } from "../networks/tokenTypes";
import { getToken } from "../token";
import { Ethereum_Query, Ethereum_Connection, Token, TokenComponent } from "../w3";
```
Here's the summary about the usage of the imported module
- `BigInt` - It's helpful to work with `BigInt` type. For more info checkout the docs here:
- `Big` - It's a library to work with `BigDecimal` type. For more info checkout the docs here:
- `getTokenType` - It's the lazy resolver that tries to predict type of the token protocol from the token metadata. For more info checkout the implementation here: 
- `getToken` - It resolves token metadata from the token address. For more info checkout the implementation here:
- `Ethereum_Query` - It's an ethereum plugin polywrapper thats useful to make contract calls. For more info checkout the docs here:
- `Ethereum_Connection` - It's a type to pass **JSON-RPC** URL or **network name** to the ethereum plugin. For more info checkout the docs here:
- `Token` - It's a datastructure to hold token address and its metadata. For more info checkout the implementation here:
- `TokenComponent` - It's a datastructure to hold token component metadata, rate and protocol type. For more info checkout the implementation here:

### 2. getComponents implementation
```typescript
export function getComponents(
  token: Token,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const tokenResult = new Array<string>(2);
  tokenResult[0] = Ethereum_Query.callContractView({
    address: token.address,
    method: "function token0() view returns (address)",
    args: [],
    connection: connection,
  });
  tokenResult[1] = Ethereum_Query.callContractView({
    address: token.address,
    method: "function token1() view returns (address)",
    args: [],
    connection: connection,
  });
  if (!(tokenResult[0] && tokenResult[1])) return [];

  const tokenDecimals = BigInt.fromString("10").pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()).div(Big.of(tokenDecimals));

  const components = new Array<TokenComponent>(2);

  for (let i = 0; i < 2; i++) {
    const underlyingToken: Token = getToken(tokenResult[i], connection);
    const balanceResult = Ethereum_Query.callContractView({
      address: underlyingToken.address,
      method: "function balanceOf(address) view returns (uint256)",
      args: [token.address],
      connection: connection,
    });
    if (!balanceResult) return [];

    const underlyIngDecimals = BigInt.fromString("10").pow(underlyingToken.decimals).toString();
    const balance: Big = Big.of(balanceResult).div(Big.of(underlyIngDecimals));

    components[i] = {
      token: underlyingToken,
      type: getTokenType(underlyingToken, connection),
      rate: balance.div(totalSupply).toString(),
    };
  }

  return components;
}
```

As you can see, it takes `token` and `connection` as arguments and returns array of underlying `TokenComponent`. To implement this function you first need to get familiarised with the protocol and understand how it works. 

For example, In case of Uniswap, you first need to understand the protocol by reading docs and then you can checkout any UNI-V2 token contract on etherscan: [0x0a965a4caf929338044c593d82d385c4c898d8c6](https://etherscan.io/address/0x0a965a4caf929338044c593d82d385c4c898d8c6). You can also leverage Zerion defi-sdk adapter implementation as reference: [Zerion adapters](https://github.com/zeriontech/defi-sdk/tree/master/contracts/adapters) if they already exists.

Once you have figure out how the logic of how to fetch underlying token components from the protocol token. You can implement it easily with the help of ethereum plugin polywrapper.

To call a smart-contract from the polywrapper, you need to use the following function:
```typescript
Ethereum_Query.callContractView({
  address: token.address,
  method: "function token0() view returns (address)",
  args: [],
  connection: connection,
});
```
- **address** is the address of the smart-contract
- **method** is the solidity function interface
- **args** is the array of string of smart-contract arguments. You can also pass array as an argument by encoding it in the JSON format.
- **connection** is the connection object passed by client.

> Note: make sure to use appropriate data type for calculation to avoid overflow or any other weird errors, BigInt for Integers and Big for Decimals/Floats.

Now you need to create a new field in the TokenProtocolType enum inside [commons/schema.graphql](../../commons/schema.graphql). Make sure to `yarn codegen` after making the change.

Now you need to create the lazy protocol resolver for the protocol you implemented. It can be implemented simply by adding conditions to determine correct protocol from the token metadata. Here's the example of lazy protocol resolver for mainnet: [tokenTypes.ts](../networks/mainnet/tokenTypes.ts). Make sure to add this for all the supported network.
```ts
export function getTokenType(token: Token): TokenProtocolType {
  if (token.name.startsWith("Curve.fi ") && token.name.endsWith(" Gauge Deposit")) {
    return TokenProtocolType.CurveGauge;
  } 
  ...
  else if (token.name == "SushiBar") {
    return TokenProtocolType.Sushibar;
  }
  // Insert your new protocol here
  else if (token.name == "MyNewProtocol") {
    return TokenProtocolType.MyNewProtocol;
  } 
  ...
  else {
    return TokenProtocolType.Native;
  }
}
```


Once you are done with implementing the adapter, you need to create a recipe script so that others can quickly test your adapter.

1. Create a new recipe directory for your adapter by duplicating [defi-sdk/recipes/adapters/aave](../../../recipes/adapters/aave) folder.

2. Look for the tokens you want to include for the protocol. *For example, to test if Aave tokens are correctly processed on Avalanche, we'll look for their token data on Aave's documentation, and inspect avalanche's block explorer:*
   - Token name: `Aave Avalanche Market DAI`
   - Token symbol: `avDAI`
   - Token address: `0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a`*.
    > Make sure to include all the networks currently supported by the protocol you implemented.

3. With this date, we edit the [defi-sdk/recipes/adapters/aave/e2e.json](../../../recipes/adapters/aave/e2e.json) to include the one token you're testing:
    
    ```json
    {
      "query": "./avalanche.graphql",
      "variables": {
        "address": "0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a",
        "node": "https://api.avax.network/ext/bc/C/rpc"
      }
    }
    ``` 
    
    > Note: Use google to find your network's RPC address, and add it in the node field
    
    To have a thorough test, you should add the tokens from other protocols in that same network. For example, a few steps above we've added two protocols that already had [adapters](../../../recipes/adapters/) (Sushiswap and Curve.fi, which both are in Avalanche Network)


Now you need to update the `getComponents` function in the [index.ts](../index.ts). First of all import the `getComponents` function from the adapter you created
```ts
import { getComponents as aaveGetComponents } from "./adapters/aave";
```

Now add it inside the `switch...case...` so that we can handle it correctly. 
```ts
switch (components[i].type) {
  case TokenProtocolType.YearnV1:
    curComponents = yearnGetComponents(components[i].token, "V1", input.connection);
    break;
  ...
  // Your protocol handler
  case TokenProtocolType.AaveV1:
    curComponents = aaveGetComponents(components[i].token, "V1", input.connection);
    break;
  ...
  default:
    break;
} 
``` 

## To test your integration run these commands
First make sure you have `Docker` running on your computer.

Then, from the terminal, go to the repo's root folder and run these commands. 
***Keep in mind that the polywrap toolchain is still in pre-alpha, so running each of these commands can take up to 10 minutes in some cases.***

- `nvm use` - To have the same node version
- `yarn` - to install dependencies>
- `cd packages/defi-sdk` - move to the defi-sdk directory
- `yarn build` - To build the defi-sdk polywrapper 
- `yarn test:env:up` - Sets up local IPFS environment to test the deployment of the wrapper
- `yarn deploy` - Deploys your wrapper to the local test network

Finally, run recipes individually as necessary.
 - `yarn recipes <adapter>` <- Use this command to run the specific aave recipe we updated.
Or run them all together, which takes a bit longer
 - `yarn recipes`

### Testing with Jest
Devs can now write integration test in jest for automated testing 
- [Aave mainnet example](../../__tests__/e2e/mainnet.spec.ts#L51)
- [Aave polygon example](../../__tests__/e2e/polygon.spec.ts#L51)

## Submitting your integration

Once your integration is working, please open a PR against the main Defiwrapper repository. Succesful integrations may qualify for a reward. 
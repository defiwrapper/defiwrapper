# DeFi SDK
A simple Defi SDK which can be used to fetch rate of the underlying token components for a derivative token.

## Supported Protocols
- Uniswap-V2
- Sushiswap
- Yearn
- Curve
- Compound
- Aave
- LinkSwap
- Cream

Checkout [examples](EXAMPLE.md) here.

## Usage

You can use this SDKs directly in your React app by first installing:
```console
yarn add @web3api/react @web3api/client
```

You can then import the Web3 API Client hook and query `defi-sdk` in your component with:
```js
import { useWeb3ApiClient } from '@web3api/react';

const w3Client = useWeb3ApiClient();
const defiSDKQuery = {
  uri: 'ipfs/QmTGiVRwYE7meSBTarqy3WRf253gebAoHMTJap2YuEnG8M',
  query: `
    query($address: String, $connection: Ethereum_Connection) {
      getComponents(
        address: $address
        connection: $connection
      )
    }
  `,
  variables: {
    address: '<Any valid protocol token address>',
    connection: {
      node: null,
      networkNameOrChainId: 'MAINNET',
    },
  },
};

async function fetch() {
  const result: DefiSDKResponse = (await w3Client.query(
    defiSDKQuery,
  ));
  ... // Do something
}

```

### Contributing
Checkout our [contributing guide](../../documentation/docs/contributing.md) if you would like to contribute to the `defi-sdk` project. If you would like to add your own protocol adapter then checkout our [how to add an adapter guide](src/query/adapters/README.md) for that. If you are interested in porting the exisiting adapters to a new network (blockchain) then checkout our [lazy resolver guide](src/query/networks/README.md)


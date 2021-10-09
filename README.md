# Defiwrapper
[![JS-CI](https://github.com/Niraj-Kamdar/defi-sdk-polywrapper/actions/workflows/js-ci.yml/badge.svg)](https://github.com/Niraj-Kamdar/defi-sdk-polywrapper/actions/workflows/js-ci.yml)

Defiwrapper is a collection of different DeFi related polywrappers like `defi-sdk`, `coingecko`, etc.

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
    address: '<Any valid ethereum account address>',
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
## Feedback & Contributions
Bugs and feature requests can be made via GitHub [issues](https://github.com/Niraj-Kamdar/defiwrapper/issues/new). Be aware that these issues are not private, so take care when providing output to make sure you are not disclosing security issues in other products.

Pull requests are also welcome via git. If you don't know how to get started with contribution, 
You can visit our [contributing guide](./CONTRIBUTING.md).

The defiwrapper uses `eslint` and `prettier` to ensure code quality of the PR.

## Built With:
- [Polywrap](https://polywrap.io/#/) - Polywrap is a development platform that enables easy integration of Web3 protocols into any application.
- [Coingecko API](https://www.coingecko.com/en/api/documentation) - CoinGecko is the world's largest independent cryptocurrency data aggregator.


## Donate:
If you find this project helpful, you can support us by donating some money on our [Gitcoin grant](https://gitcoin.co/grants/3510/defi-sdk-polywrapper) 

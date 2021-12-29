# Coingecko Polywrapper
CoinGecko polywrapper allows user to interact with Coingecko API easily in any platform or 
another polywrapper.

## Supported Protocols
- **ping** - `/ping`
- **supportedVSCurrencies** - `/simple/supported_vs_currencies`
- **coinsList** - `/coins/list`
- **coinsMarkets** - `/coins/market`
- **simplePrice** - `/simple/price`
- **simpleTokenPrice** - `simple/token_price/{id}`
- **tokenInfo** - `coins/{id}/contract/{contract_address}`
- **tokenMarketChart** - `coins/{id}/contract/{contract_address}/market_chart`
- **coinMarketChartRange** - `coins/{id}/market_chart/range`

Checkout [examples](EXAMPLE.md) here.

## Usage

You can use this SDKs directly in your React app by first installing:
```console
yarn add @web3api/react @web3api/client
```

You can then import the Web3 API Client hook and query `coingecko` in your component with:
```js
import { useWeb3ApiClient } from '@web3api/react';

const w3Client = useWeb3ApiClient();
const query = {
  uri: 'ens/rinkeby/coingecko.defiwrapper.eth',
  query: `
    query SimplePrice(
      $ids: [String!]!,
      $vs_currencies: [String!]!,
      $include_market_cap: Boolean,
      $include_24hr_vol: Boolean,
      $include_24hr_change: Boolean,
      $include_last_updated_at: Boolean
    ) {
      simplePrice(
        ids: $ids,
        vs_currencies: $vs_currencies,
        include_market_cap: $include_market_cap,
        include_24hr_vol: $include_24hr_vol,
        include_24hr_change: $include_24hr_change,
        include_last_updated_at: $include_last_updated_at
      )
    }
  `,
  variables: {
    ids: ["ethereum", "solana"],
    vs_currencies: ["usd", "btc"],
    include_market_cap: false,
    include_24hr_vol: false,
    include_24hr_change: false,
    include_last_updated_at: true
  },
};

async function fetch() {
  const result = (await w3Client.query(
    query,
  ));
  ... // Do something
}

```

### Contributing
Checkout our [contributing guide](../../documentation/docs/contributing.md) if you would like to contribute to the `coingecko` polywrapper. If you would like to add a new coingecko endpoint then checkout our [how to add an endpoint guide](src/query/README.md) for that.

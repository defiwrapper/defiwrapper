# Examples
-----------------------------------
## Query
```graphql
query Ping {
  ping
}
```
## Input
```json
{}
```
## Output
```json
{
  "ping": {
    "gecko_says": "(V3) To the Moon!"
  }
}
```
-----------------------------------

## Query
```graphql
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
```
## Input
```json
{
  "ids": [
    "ethereum",
    "solana"
  ],
  "vs_currencies": [
    "usd",
    "btc"
  ],
  "include_market_cap": false,
  "include_24hr_vol": false,
  "include_24hr_change": false,
  "include_last_updated_at": true
}
```
## Output
```json
{
  "simplePrice": [
    {
      "id": "ethereum",
      "price_data": [
        {
          "vs_currency": "usd",
          "price": "4380.62",
          "market_cap": null,
          "vol_24h": null,
          "change_24h": null
        },
        {
          "vs_currency": "btc",
          "price": "0.08688179",
          "market_cap": null,
          "vol_24h": null,
          "change_24h": null
        }
      ],
      "last_updated_at": "1638956040"
    },
    {
      "id": "solana",
      "price_data": [
        {
          "vs_currency": "usd",
          "price": "190.14",
          "market_cap": null,
          "vol_24h": null,
          "change_24h": null
        },
        {
          "vs_currency": "btc",
          "price": "0.00377107",
          "market_cap": null,
          "vol_24h": null,
          "change_24h": null
        }
      ],
      "last_updated_at": "1638956075"
    }
  ]
}
```
-----------------------------------


---
id: asset-resolver-interface
title: Asset Resolver Interface
---

## Types

### TokenComponent

_An asset and its underlying components, each of which contains the exchange rate between the asset and the component_

```graphql
type TokenComponent {
  tokenAddress: String! # Address of the asset
  unresolvedComponents: Int! # Number of underlying components that could not be resolved; the higher the number, the higher the inaccuracy
  components: TokenComponent[]! # Underlying components
  rate: String! # Rate of exchange between parent asset and this asset
}
```

## Methods

### getTokenComponents

_Returns the effective token components balance in the currencies given by client for the given token_

```graphql
getTokenComponents(
  tokenAddress: String! # Address of the asset
  protocolId: String! # ID of the asset protocol, as listed in protocol resolver
): TokenComponent!
```

### isValidProtocolToken

_Returns true if the given token is a valid protocol token_

```graphql
isValidProtocolToken(
  tokenAddress: String! # Address of the asset
  protocolId: String! # ID of the asset protocol, as listed in protocol resolver
): Boolean!
```


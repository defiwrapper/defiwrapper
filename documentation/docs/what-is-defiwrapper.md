---
id: what-is-defiwrapper
title: What is Defiwrapper?
---

### 1. What is the defiwrapper?
Defiwrapper is a collection of different DeFi related polywrappers like defi-sdk, coingecko, and many more to be added in future. Since polywrappers are written in webassembly they are cross-platform, sandboxed, composable and yet light-weight than traditional JS SDKs. 

### 2. What is defi-sdk?
defi-sdk is one of the polywrapper offered by defiwrapper. It's a cross-chain defi aggregator sdk. 

### 3. Why yet another defi-sdk?
The reason for building yet another SDK is the problems with current SDKs:

1) Some SDK uses smart-contracts for aggregating the data from various protocol but this isn’t very scalable and efficient
2) Some SDK uses centralised server for this and gated with Oauth and what not.
3) Only EVM compatible, doesn't support other popular L1 like Solana, Cardano, 

We are creating a decentralized, scalable and trully cross-chain SDK.

### 4. What's the advantage of coingecko polywrapper over normal calling coingecko API directly?
- Coingecko polywrapper has concrete schema for input, output and all the methods which makes it easy to develop with it. 
- It will do input validation and parse output in the correct schema format so that client of coingecko polywrapper don't need to do it manually. 
- It can securely run on any WASM runtime. Ex: You can run it inside Gelato resolver.
- It is easily composable with other polywrappers.

<!-- ### 5. What are the use-cases of defiwrapper?
Here are some usecases of defiwrapper:
1. Polifolio - Cross-chain defi portfolio - link to polyfolio figma prototype
2. DAO treasury dashboard - a supercharged version of [open-orgs](https://openorgs.info/)
3. DeFi bots and apis using gelato - Ex: link to gelato-simple-oracle -->

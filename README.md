# Defiwrapper 
Defiwrapper is a collection of different DeFi related polywrappers like defi-sdk, coingecko, etc. With Defiwrapper, we want to create a cross-chain multi-platform suite of DeFi related polywrappers.

## Project Q&A

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

## Project Updates

- Drafted new, detailed Defiwrapper spec
- Onboarded 3 new contributors (Juan, Colin, James)
- Enabled EVM interoperability - Added support for multiple EVM compatible chain like Polygon and Avax.
- Started Polyfolio - a cross-chain defi portfolio
- Created a POC Simple Oracle using gelato and coingecko defiwrapper.

## Feedback & Contributions
Bugs and feature requests can be made via GitHub [issues](https://github.com/Niraj-Kamdar/defiwrapper/issues/new). Be aware that these issues are not private, so take care when providing output to make sure you are not disclosing security issues in other products.

Pull requests are also welcome via git. If you don't know how to get started with contribution, 
You can visit our [contributing guide](/documentation/docs/contributing.md).

To add compatibility with other EVM networks through their chainID [follow this quick tutorial](./packages/defi-sdk/src/query/networks/README.md) and open a PR.

The defiwrapper uses `eslint` and `prettier` to ensure code quality of the PR.

## Social Media

- Discord: [https://discord.gg/weacsjJQ](https://discord.gg/weacsjJQ)
- Github: [https://github.com/defiwrapper/defiwrapper](https://github.com/defiwrapper/defiwrapper)
- Email: [defiwrapper@gmail.com](mailto:defiwrapper@gmail.com)

## Built With:
- [Polywrap](https://polywrap.io/#/) - Polywrap is a development platform that enables easy integration of Web3 protocols into any application.
- [Coingecko API](https://www.coingecko.com/en/api/documentation) - CoinGecko is the world's largest independent cryptocurrency data aggregator.


## Donate:
If you find this project helpful, you can support us by donating some money on our [Gitcoin grant](https://gitcoin.co/grants/3510/defi-sdk-polywrapper).

If you have made a donation to our project, please enter our social media as soon as possible, especially discord! We will post updates through our social media in the future. Thanks again to everyone who has donated to the Defiwrapper!

import { BigInt } from "@web3api/wasm-as";

import { ProtocolBalance } from "../../w3";

export const uniswapProtocol: ProtocolBalance = {
  protocol: {
    id: "uniswap_v2",
    organization: "Uniswap",
    name: "Uniswap",
    adapterUri: "ens/uniswap.token-resolvers.defiwrapper.eth",
    version: "2",
    forkedFrom: null,
  },
  values: [
    {
      currency: "usd",
      price: "N/A",
      value: "10,920.855113993",
    },
  ],
  assets: [
    {
      apy: "8.67",
      apr: null,
      isDebt: false,
      balance: {
        token: {
          token: {
            address: "0x0a965a4caf929338044c593d82d385c4c898d8c6",
            name: "Uniswap V2",
            symbol: "UNI-V2",
            decimals: 18,
            totalSupply: BigInt.fromString("3421511230657799317704"),
          },
          balance: "12",
          values: [
            {
              currency: "usd",
              price: "893",
              value: "10,720.855113993",
            },
          ],
        },
        unresolvedComponents: 0,
        components: [
          {
            token: {
              token: {
                address: "0x35bD01FC9d6D5D81CA9E055Db88Dc49aa2c699A8",
                name: "Friends With Benefits Pro",
                symbol: "FWB",
                decimals: 18,
                totalSupply: BigInt.fromString("1000000000000000000000000"),
              },
              balance: "56.775651421",
              values: [
                {
                  currency: "usd",
                  price: "50.70",
                  value: "2,878.5255270447",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
          {
            token: {
              token: {
                address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                name: "Wrapped Ether",
                symbol: "WETH",
                decimals: 18,
                totalSupply: BigInt.fromString("7025353631329550976333864"),
              },
              balance: "3.0003097309",
              values: [
                {
                  currency: "usd",
                  price: "2,613.84",
                  value: "7,842.3295869483",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
        ],
      },
      claimableTokens: [
        {
          token: {
            address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            name: "Uniswap",
            symbol: "UNI",
            decimals: 18,
            totalSupply: BigInt.fromString("1000000000000000000000000"),
          },
          balance: "3.98",
          values: [
            {
              currency: "usd",
              price: "10",
              value: "39.8",
            },
          ],
        },
        {
          token: {
            address: "0x35bD01FC9d6D5D81CA9E055Db88Dc49aa2c699A8",
            name: "Friends With Benefits Pro",
            symbol: "FWB",
            decimals: 18,
            totalSupply: BigInt.fromString("1000000000000000000000000"),
          },
          balance: "3.98",
          values: [
            {
              currency: "usd",
              price: "50",
              value: "199",
            },
          ],
        },
      ],
    },
    {
      apy: "7.34",
      apr: null,
      isDebt: false,
      balance: {
        token: {
          token: {
            address: "0x0a965a4caf929338044c593d82d385c4c898d8c6",
            name: "Uniswap V2",
            symbol: "UNI-V2",
            decimals: 18,
            totalSupply: BigInt.fromString("3421511230657799317704"),
          },
          balance: "100",
          values: [
            {
              currency: "usd",
              price: "2",
              value: "100",
            },
          ],
        },
        unresolvedComponents: 0,
        components: [
          {
            token: {
              token: {
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                name: "USD Coin",
                symbol: "USDC",
                decimals: 6,
                totalSupply: BigInt.fromString("1000000000000000000000000"),
              },
              balance: "100",
              values: [
                {
                  currency: "usd",
                  price: "1",
                  value: "100",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
          {
            token: {
              token: {
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                name: "Dai Stablecoin",
                symbol: "DAI",
                decimals: 18,
                totalSupply: BigInt.fromString("7025353631329550976333864"),
              },
              balance: "100",
              values: [
                {
                  currency: "usd",
                  price: "1",
                  value: "100",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
        ],
      },
      claimableTokens: [
        {
          token: {
            address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            name: "Uniswap",
            symbol: "UNI",
            decimals: 18,
            totalSupply: BigInt.fromString("1000000000000000000000000"),
          },
          balance: "2.45",
          values: [
            {
              currency: "usd",
              price: "10",
              value: "24.5",
            },
          ],
        },
      ],
    },
  ],
};

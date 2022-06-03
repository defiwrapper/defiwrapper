import { BigInt } from "@web3api/wasm-as";

import { ProtocolBalance } from "../../w3";

export const sushiswapProtocol: ProtocolBalance = {
  protocol: {
    id: "sushibar_v1",
    organization: "Sushi",
    name: "Sushibar",
    adapterUri: "ens/sushiswap.token-resolvers.defiwrapper.eth",
    version: "1",
    forkedFrom: null,
  },
  values: [
    {
      currency: "usd",
      price: "N/A",
      value: "10764.28",
    },
  ],
  assets: [
    {
      apy: null,
      apr: null,
      isDebt: false,
      balance: {
        token: {
          token: {
            address: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
            name: "SushiBar",
            symbol: "xSUSHI",
            decimals: 18,
            totalSupply: BigInt.fromString("68828762817907898982295808"),
          },
          balance: "12",
          values: [
            {
              currency: "usd",
              price: "3.69",
              value: "44.28",
            },
          ],
        },
        unresolvedComponents: 0,
        components: [
          {
            token: {
              token: {
                address: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
                name: "SushiToken",
                symbol: "SUSHI",
                decimals: 18,
                totalSupply: BigInt.fromString("232539564055938576031638126"),
              },
              balance: "15.1643835616",
              values: [
                {
                  currency: "usd",
                  price: "2.92",
                  value: "35.04",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
        ],
      },
      claimableTokens: [],
    },
    {
      apy: "8.67",
      apr: null,
      isDebt: false,
      balance: {
        token: {
          token: {
            address: "0x0a965a4caf929338044c593d8967485c4c898d8c6",
            name: "Sushiswap LP Token",
            symbol: "SLP",
            decimals: 18,
            totalSupply: BigInt.fromString("3421511230657799317704"),
          },
          balance: "12",
          values: [
            {
              currency: "usd",
              price: "188.8283946669",
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
  ],
};

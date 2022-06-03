import { BigInt } from "@web3api/wasm-as";

import { ProtocolBalance } from "../../w3";

export const yearnProtocol: ProtocolBalance = {
  protocol: {
    id: "yearn_vault_v2",
    organization: "Yearn.finance",
    version: "2",
    adapterUri: "ens/yearn.token.resolvers.defiwrapper.eth",
    name: "Yearn Vault",
    forkedFrom: null,
  },
  values: [
    {
      currency: "usd",
      price: "N/A",
      value: "600",
    },
  ],
  assets: [
    {
      apy: "10",
      apr: null,
      isDebt: false,
      balance: {
        token: {
          token: {
            address: "0x19d3364a399d251e894ac732651be8b0e4e85001",
            name: "DAI yVault",
            symbol: "yvDAI",
            decimals: 18,
            totalSupply: BigInt.fromString("15252283361365664804894465"),
          },
          balance: "200",
          values: [
            {
              currency: "usd",
              price: "1.1",
              value: "220",
            },
          ],
        },
        unresolvedComponents: 0,
        components: [
          {
            token: {
              token: {
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                name: "Dai Stablecoin",
                symbol: "DAI",
                decimals: 18,
                totalSupply: BigInt.fromString("5823545023317184156033278369"),
              },
              balance: "220",
              values: [
                {
                  currency: "usd",
                  price: "1",
                  value: "220",
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
            address: "0x2994529c0652d127b7842094103715ec5299bbed",
            name: "yearn Curve.fi yDAI/yUSDC/yUSDT/yBUSD",
            symbol: "yyDAI+yUSDC+yUSDT+yBUSD",
            decimals: 18,
            totalSupply: BigInt.fromString("353786341083841590828850"),
          },
          balance: "400",
          values: [
            {
              currency: "usd",
              price: "1.15",
              value: "460",
            },
          ],
        },
        unresolvedComponents: 0,
        components: [
          {
            token: {
              token: {
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                name: "Dai Stablecoin",
                symbol: "DAI",
                decimals: 18,
                totalSupply: BigInt.fromString("5823545023317184156033278369"),
              },
              balance: "120",
              values: [
                {
                  currency: "usd",
                  price: "1",
                  value: "120",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
          {
            token: {
              token: {
                address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                name: "USD Coin",
                symbol: "USDC",
                decimals: 6,
                totalSupply: BigInt.fromString("26023568159239550"),
              },
              balance: "110",
              values: [
                {
                  currency: "usd",
                  price: "1",
                  value: "110",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
          {
            token: {
              token: {
                address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                name: "Tether USD",
                symbol: "USDT",
                decimals: 6,
                totalSupply: BigInt.fromString("33873006368948501"),
              },
              balance: "130",
              values: [
                {
                  currency: "usd",
                  price: "1",
                  value: "130",
                },
              ],
            },
            unresolvedComponents: 0,
            components: [],
          },
          {
            token: {
              token: {
                address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
                name: "Binance USD",
                symbol: "BUSD",
                decimals: 18,
                totalSupply: BigInt.fromString("12263491683870000000000000000"),
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
      claimableTokens: [],
    },
  ],
};

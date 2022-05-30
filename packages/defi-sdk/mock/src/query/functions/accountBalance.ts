import { BigInt } from "@web3api/wasm-as";

import { AccountBalance, Input_getAccountBalance } from "../w3";
import { Ethereum_Network, Ethereum_Query } from "../w3/imported";

export function getAccountBalance(input: Input_getAccountBalance): AccountBalance {
  const network: Ethereum_Network = Ethereum_Query.getNetwork({ connection: null }).unwrap();
  return {
    account: input.accountAddress,
    chainId: network.chainId.toString(),
    values: [
      {
        currency: "usd",
        price: "N/A",
        value: "10,765.135113993",
      },
    ],
    protocols: [
      {
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
      },
      {
        protocol: {
          id: "sushibar_v1",
          organization: "Sushi",
          name: "Sushibar",
          adapterUri: "ens/sushibar.token-resolvers.defiwrapper.eth",
          version: "1",
          forkedFrom: null,
        },
        values: [
          {
            currency: "usd",
            price: "N/A",
            value: "44.28",
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
        ],
      },
    ],
    tokens: [
      {
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
          {
            currency: "eur",
            price: "1.07",
            value: "93.4",
          },
        ],
      },
      {
        token: {
          address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
          name: "Matic (POS)",
          symbol: "MATIC",
          decimals: 18,
          totalSupply: BigInt.fromString("1000000000000000000000000"),
        },
        balance: "100",
        values: [
          {
            currency: "usd",
            price: "0.5",
            value: "50",
          },
          {
            currency: "eur",
            price: "0.4",
            value: "40",
          },
        ],
      },
    ],
  };
}

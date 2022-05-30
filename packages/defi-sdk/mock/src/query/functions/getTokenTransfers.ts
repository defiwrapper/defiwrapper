import { BigInt, Nullable } from "@web3api/wasm-as";

import { Input_getTokenTransfers, TransfersList, TransferType } from "../w3";
import { Ethereum_Network, Ethereum_Query } from "../w3/imported";
import { MAR_Query } from "../w3/imported/MAR_Query";

export function getTokenTransfers(input: Input_getTokenTransfers): TransfersList {
  if (!MAR_Query.requireEnv({}).unwrap()) {
    throw new Error("requireEnv() returned false");
  }
  const network: Ethereum_Network = Ethereum_Query.getNetwork({ connection: null }).unwrap();

  return {
    account: input.accountAddress,
    updatedAt: "2022-04-01T04:06:53.745976993Z",
    nextUpdateAt: "2022-04-01T04:11:53.745977273Z",
    quoteCurrency: "usd",
    chainId: network.chainId.toString(),
    token: {
      name: "USD Coin",
      symbol: "USDC",
      address: input.tokenAddress,
      decimals: 6,
      totalSupply: BigInt.fromString("1000000000000"),
    },
    transfers: [
      {
        transaction: {
          timestamp: "2022-02-20T16:36:43Z",
          blockHeight: 14244015,
          hash: "0x38aa0a4f1ee26b776820a63559d3d5f339b4d2330abb4154ddcf087325d85207",
          offset: Nullable.fromValue<i32>(55),
          successful: true,
          to: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          value: "0",
          m_from: "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
          quote: "0.0",
          gasInfo: {
            offered: "90000",
            spent: "48525",
            price: "46567282379",
            quote: "6.210092151066492",
            quoteRate: "2748.220703125",
          },
          logs: [],
        },
        transfers: [
          {
            m_from: "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
            to: "0x197e3eccd00f07b18205753c638c3e59013a92bf",
            m_type: TransferType.IN,
            value: "40000000000",
            quoteRate: "1.0454195737838745",
            quote: "41816.78295135498",
          },
        ],
      },
      {
        transaction: {
          timestamp: "2022-02-11T09:36:58Z",
          blockHeight: 14183956,
          hash: "0x0ff3a362c2f641b202038b9590ec2d2d6f9befab30c4ffb6058531af5e6b5030",
          offset: Nullable.fromValue<i32>(30),
          successful: true,
          m_from: "0xf3890b63a66dbcac1df580997d317990507e1cd3",
          to: "0xd152f549545093347a162dce210e7293f1452150",
          value: "0",
          quote: "0.0",
          gasInfo: {
            offered: "522717",
            spent: "502722",
            price: "46835110783",
            quote: "70.98184770396895",
            quoteRate: "3014.72607421875",
          },
          logs: [],
        },
        transfers: [
          {
            m_from: "0xd152f549545093347a162dce210e7293f1452150",
            to: "0x197e3eccd00f07b18205753c638c3e59013a92bf",
            m_type: TransferType.IN,
            value: "40000000000",
            quoteRate: "1.0454195737838745",
            quote: "41816.78295135498",
          },
        ],
      },
    ],
    pagination: {
      hasMore: Nullable.fromValue(true),
      page: Nullable.fromValue(1),
      perPage: Nullable.fromValue(2),
      total: Nullable.fromValue(14),
    },
  };
}

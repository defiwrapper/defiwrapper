import { Nullable } from "@web3api/wasm-as";

import { Input_getTransactions, TransactionsList } from "../w3";
import { Ethereum_Network, Ethereum_Query } from "../w3/imported";
import { MAR_Query } from "../w3/imported/MAR_Query";

export function getTransactions(input: Input_getTransactions): TransactionsList {
  if (!MAR_Query.requireEnv({}).unwrap()) {
    throw new Error("requireEnv() returned false");
  }
  const network: Ethereum_Network = Ethereum_Query.getNetwork({ connection: null }).unwrap();

  return {
    account: input.accountAddress,
    chainId: network.chainId.toString(),
    quoteCurrency: "USD",
    transactions: [
      {
        hash: "0xbf213c1d6350c86cbeebc6ddea8138e40d438c6a6591e3a6cd19f7422fcf4ddf",
        m_from: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        to: "0x3b484b82567a09e2588a13d54d032153f0c0aee0",
        value: "0",
        quote: "0.0",
        gasInfo: {
          offered: "55932",
          spent: "46610",
          price: "37867674392",
          quoteRate: "2934.027587890625",
          quote: "5.178594791174604",
        },
        logs: [
          {
            contractAddress: "0x3b484b82567a09e2588a13d54d032153f0c0aee0",
            logOffset: 396,
            topics: [
              "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
              "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
            ],
            data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            event: {
              name: "Approval",
              signature: "Approval(indexed address owner, indexed address spender, uint256 value)",
              params: [
                {
                  name: "owner",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "spender",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
                },
                {
                  name: "value",
                  m_type: "uint256",
                  indexed: false,
                  decoded: true,
                  value:
                    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
                },
              ],
            },
          },
        ],
        successful: true,
        timestamp: "2022-02-12T13:07:36Z",
        blockHeight: 14191428,
        offset: Nullable.fromValue(269),
      },
      {
        hash: "0x895df40e50f22cedfff6b835388c7bf741f0e943ab0aedbf76fdf268090506c8",
        m_from: "0x88eaf971d7babed6d13dd31d0aa7dc5c1f3f7989",
        to: "0x3b484b82567a09e2588a13d54d032153f0c0aee0",
        value: "0",
        quote: "0.0",
        gasInfo: {
          offered: "52509",
          spent: "35006",
          price: "37300015589",
          quoteRate: "3032.827392578125",
          quote: "3.9600365628209913",
        },
        logs: [
          {
            contractAddress: "0x3b484b82567a09e2588a13d54d032153f0c0aee0",
            logOffset: 344,
            topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x00000000000000000000000088eaf971d7babed6d13dd31d0aa7dc5c1f3f7989",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
            ],
            data: "0x000000000000000000000000000000000000000000062ddd47196a2efa03c000",
            event: {
              name: "Transfer",
              signature: "Transfer(indexed address from, indexed address to, uint256 value)",
              params: [
                {
                  name: "from",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x88eaf971d7babed6d13dd31d0aa7dc5c1f3f7989",
                },
                {
                  name: "to",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "value",
                  m_type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "7470143263100000000000000",
                },
              ],
            },
          },
        ],
        timestamp: "2022-02-05T11:27:24Z",
        blockHeight: 14145756,
        successful: true,
        offset: Nullable.fromValue(331),
      },
      {
        hash: "0x35f53e65dd6bfa4f11f290f0b19fa3e05e1c6f981732e4d805ccf57425b5ea3f",
        m_from: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        to: "0xf1f3ca6268f330fda08418db12171c3173ee39c9",
        successful: true,
        value: "0",
        quote: "0.0",
        gasInfo: {
          offered: "54083",
          spent: "27572",
          price: "37300015589",
          quoteRate: "3032.827392578125",
          quote: "3.1190689627521104",
        },
        logs: [],
        timestamp: "2022-02-05T11:27:24Z",
        blockHeight: 14145756,
        offset: Nullable.fromValue(257),
      },
      {
        hash: "0x9baf528b5e9ed281e032007e19ecf33f5f910fecc16acb4692d5432aad47f383",
        m_from: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        to: "0x3b484b82567a09e2588a13d54d032153f0c0aee0",
        value: "0",
        quote: "0.0",
        gasInfo: {
          offered: "56323",
          spent: "56323",
          price: "35994320201",
          quoteRate: "4061.338134765625",
          quote: "8.23358368396935",
        },
        logs: [
          {
            contractAddress: "0x3b484b82567a09e2588a13d54d032153f0c0aee0",
            logOffset: 343,
            topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x0000000000000000000000000000000000000000000000000000000000000000",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
            ],
            data: "0x0000000000000000000000000000000000000000000a8816173e7d3d9622c000",
            event: {
              name: "Transfer",
              signature: "Transfer(indexed address from, indexed address to, uint256 value)",
              params: [
                {
                  name: "from",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x0000000000000000000000000000000000000000",
                },
                {
                  name: "to",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "value",
                  m_type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "12731907541100000000000000",
                },
              ],
            },
          },
        ],
        timestamp: "2021-12-26T05:00:25Z",
        blockHeight: 13878775,
        successful: true,
        offset: Nullable.fromValue(169),
      },
      {
        hash: "0x9fd2eb7db94cf71ddc665b48dad42e1d00d90ace525fd6a0479f958cce8a729f",
        m_from: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        to: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        value: "0",
        quote: "0.0",
        gasInfo: {
          offered: "99244",
          spent: "60825",
          price: "56021917429",
          quoteRate: "3942.78369140625",
          quote: "13.435166043502429",
        },
        logs: [
          {
            contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            logOffset: 545,
            topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
              "0x0000000000000000000000004869abed21ab40176a55e16d1fb46087067d628b",
            ],
            data: "0x00000000000000000000000000000000000000000000000000000000945d9d55",
            event: {
              name: "Transfer",
              signature: "Transfer(indexed address from, indexed address to, uint256 value)",
              params: [
                {
                  name: "from",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "to",
                  m_type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x4869abed21ab40176a55e16d1fb46087067d628b",
                },
                {
                  name: "value",
                  m_type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "2489163093",
                },
              ],
            },
          },
        ],
        timestamp: "2021-12-23T16:29:44Z",
        blockHeight: 13862518,
        successful: true,
        offset: Nullable.fromValue(365),
      },
    ],
    pagination: {
      total: Nullable.fromNull<i32>(),
      perPage: Nullable.fromValue(10),
      page: Nullable.fromValue(1),
      hasMore: Nullable.fromValue(true),
    },
    updatedAt: "2022-04-01T10:36:17.111543568Z",
    nextUpdateAt: "2022-04-01T10:41:17.111543858Z",
  };
}

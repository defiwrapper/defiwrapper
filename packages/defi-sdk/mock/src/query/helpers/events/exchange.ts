import { Nullable } from "@web3api/wasm-as";

import { Transaction } from "../../w3";
import { getRandomBigValue } from "../constants/bigvalues";
import { getRandomPool } from "../constants/pools";
import { getRandomTimestamp } from "../constants/timestamp";
import { getRandomTransaction } from "../constants/transactions";
import { randint } from "../random";

export function getExchangeTransaction(address: string): Transaction {
  const pool = getRandomPool();
  const rounter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const gasPrice = 37867674392.0 * (randint() % 10);
  const quotePrice = randint();
  const quote = randint();
  const block = randint() * 10000;
  return {
    hash: getRandomTransaction(),
    m_from: address,
    to: rounter,
    value: "0",
    quote: "0.0",
    gasInfo: {
      offered: "55932",
      spent: "46610",
      price: gasPrice.toString(),
      quoteRate: quotePrice.toString(),
      quote: quote.toString(),
    },
    logs: [
      {
        contractAddress: pool.pair,
        logOffset: 71,
        topics: [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d",
          "0x000000000000000000000000c623786dbdcc60b4288a0412f53afd44966a6a28",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        event: {
          name: "Swap",
          signature:
            "Swap(indexed address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, indexed address to)",
          params: [
            {
              name: "sender",
              m_type: "address",
              indexed: true,
              decoded: true,
              value: rounter,
            },
            {
              name: "amount0In",
              m_type: "uint256",
              indexed: false,
              decoded: true,
              value: "0",
            },
            {
              name: "amount1In",
              m_type: "uint256",
              indexed: false,
              decoded: true,
              value: "455927827029871361",
            },
            {
              name: "amount0Out",
              m_type: "uint256",
              indexed: false,
              decoded: true,
              value: "54237600000000000000",
            },
            {
              name: "amount1Out",
              m_type: "uint256",
              indexed: false,
              decoded: true,
              value: "0",
            },
            {
              name: "to",
              m_type: "address",
              indexed: true,
              decoded: true,
              value: address,
            },
          ],
        },
      },
      {
        contractAddress: pool.pair,
        logOffset: 70,
        topics: ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        event: {
          name: "Sync",
          signature: "Sync(uint112 reserve0, uint112 reserve1)",
          params: [
            {
              name: "reserve0",
              m_type: "uint112",
              indexed: false,
              decoded: true,
              value: "203086698208159643179",
            },
            {
              name: "reserve1",
              m_type: "uint112",
              indexed: false,
              decoded: true,
              value: "1096652849110367114011284",
            },
          ],
        },
      },
      {
        contractAddress: pool.token1,
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
              value: address,
            },
            {
              name: "to",
              m_type: "address",
              indexed: true,
              decoded: true,
              value: pool.pair,
            },
            {
              name: "value",
              m_type: "uint256",
              indexed: false,
              decoded: true,
              value: getRandomBigValue(),
            },
          ],
        },
      },
      {
        contractAddress: pool.token0,
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
              value: pool.pair,
            },
            {
              name: "to",
              m_type: "address",
              indexed: true,
              decoded: true,
              value: address,
            },
            {
              name: "value",
              m_type: "uint256",
              indexed: false,
              decoded: true,
              value: getRandomBigValue(),
            },
          ],
        },
      },
    ],
    successful: true,
    timestamp: getRandomTimestamp(),
    blockHeight: block,
    offset: Nullable.fromValue(<i32>quote),
  };
}

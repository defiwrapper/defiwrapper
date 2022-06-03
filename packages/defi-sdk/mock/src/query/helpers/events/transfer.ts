import { Nullable } from "@web3api/wasm-as";

import { Transaction } from "../../w3";
import { getRandomBigValue } from "../constants/bigvalues";
import { getRandomTimestamp } from "../constants/timestamp";
import { getRandomToken } from "../constants/tokens";
import { getRandomTransaction } from "../constants/transactions";
import { randint } from "../random";

export function getTransferTransaction(address: string): Transaction {
  const token = getRandomToken();
  const gasPrice = 37867674392.0 * (randint() % 10);
  const quotePrice = randint();
  const quote = randint();
  const block = randint() * 10000;
  return {
    hash: getRandomTransaction(),
    m_from: address,
    to: token,
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
        contractAddress: token,
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
              value: token,
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

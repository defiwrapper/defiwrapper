import { Nullable } from "@web3api/wasm-as";

import { Transaction } from "../../w3";
import { getRandomTimestamp } from "../constants/timestamp";
import { getRandomToken } from "../constants/tokens";
import { getRandomTransaction } from "../constants/transactions";
import { randint } from "../random";

export function getGravatarTransaction(address: string): Transaction {
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
      offered: "54083",
      spent: "27572",
      price: gasPrice.toString(),
      quoteRate: quotePrice.toString(),
      quote: quote.toString(),
    },
    logs: [
      {
        contractAddress: token,
        logOffset: 396,
        topics: [
          "0x8c5be1e5ebec7d56429f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
          "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        event: {
          name: "Gravatar",
          signature: "Gravatar(indexed address owner, indexed address reciever, uint256 value)",
          params: [
            {
              name: "owner",
              m_type: "address",
              indexed: true,
              decoded: true,
              value: address,
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
              value: "1246",
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

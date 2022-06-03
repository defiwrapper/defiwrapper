import { Nullable } from "@web3api/wasm-as";

import { Transaction } from "../../w3";
import { getRandomTimestamp } from "../constants/timestamp";
import { getRandomToken } from "../constants/tokens";
import { getRandomTransaction } from "../constants/transactions";
import { randint } from "../random";

export function getEmptyTransaction(address: string): Transaction {
  const token = getRandomToken();
  const gasPrice = 37867674392.0 * (randint() % 10);
  const quotePrice = randint();
  const quote = randint();
  const block = randint() * 10000;
  return {
    hash: getRandomTransaction(),
    m_from: address,
    to: token,
    value: "5100000000000000000",
    quote: "10000",
    gasInfo: {
      offered: "54083",
      spent: "27572",
      price: gasPrice.toString(),
      quoteRate: quotePrice.toString(),
      quote: quote.toString(),
    },
    logs: [],
    successful: true,
    timestamp: getRandomTimestamp(),
    blockHeight: block,
    offset: Nullable.fromValue(<i32>quote),
  };
}

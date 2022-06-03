import { Nullable } from "@web3api/wasm-as";

import { TransfersPerTx, TransferType } from "../../w3";
import { getRandomTimestamp } from "../constants/timestamp";
import { randint } from "../random";
import { getToken } from "./tokenInfo";

export function getRandomTransfer(accountAddress: string, tokenAddress: string): TransfersPerTx {
  const token = getToken(tokenAddress);
  const gasPrice = 37867674392.0 * (randint() % 10);
  const quotePrice = randint();
  const quote = randint();
  const block = randint() * 10000;
  return {
    transaction: {
      timestamp: getRandomTimestamp(),
      blockHeight: block,
      hash: "0x38aa0a4f1ee26b776820a63559d3d5f339b4d2330abb4154ddcf087325d85207",
      offset: Nullable.fromValue<i32>(55),
      successful: true,
      to: token.address,
      value: "0",
      m_from: "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
      quote: "0.0",
      gasInfo: {
        offered: "90000",
        spent: "48525",
        price: gasPrice.toString(),
        quote: quote.toString(),
        quoteRate: quotePrice.toString(),
      },
      logs: [],
    },
    transfers: [
      {
        m_from: "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
        to: "0x197e3eccd00f07b18205753c638c3e59013a92bf",
        m_type: TransferType.IN,
        value: "40000",
        quoteRate: "1.0454195737838745",
        quote: "41816.78295135498",
      },
      {
        m_from: "0x197e3eccd00f07b18205753c638c3e59013a92bf",
        to: "0xec4486a90371c9b66f499ff3936f29f0d5af8b7e",
        m_type: TransferType.OUT,
        value: "20000",
        quoteRate: "1.0454195737838745",
        quote: "20908.78295135498",
      },
    ],
  };
}

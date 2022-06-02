import { randint } from "../random";

const txns = [
  "0xbf213c1d6350c86cbeebc6ddea8138e40d438c6a6591e3a6cd19f7422fcf4ddf",
  "0xd3569701b33ca66d74c8cbc14086cab412da0efc44dc51dd1ec6c1ba5bcd7930",
  "0xfae8f050417800a0ed0a57ba876086d6b8682aac7fcfcc8c8f9e5107be4228ec",
  "0xacdcd568aea8535bca0001b1a1eab3df7cde87c97f95ed7e8c47df2b97afcde0",
  "0x2fb83c922f24be643359221f732d7ffd9e35737abb7b5c6bf030e54ce08b31da",
  "0xc085868ea42765b615583c84d5f50cd0ba676044b99a85b789daefbfe456d3e5",
  "0xbc08765e32038c3e09b4d508d3cc25d51d102e7b1b8ee405eabd1ec5143e625e",
];

export function getRandomTransaction(): string {
  return txns[randint() % txns.length];
}

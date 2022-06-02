import { randint } from "../random";

export interface Pool {
  pair: string;
  token0: string;
  token1: string;
}

const pools: Pool[] = [
  {
    pair: "0x00d1420bc0d7ae37d33ad9162161c95e46a9f40d",
    token0: "0x03a5c5f12bd0bbae973215b1c184ff3ce9942cfc",
    token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  {
    pair: "0x00d3ae2a0a1abe4c3a1b180a081641c75ea9c019",
    token0: "0x1d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd",
    token1: "0x2e1e15c44ffe4df6a0cb7371cd00d5028e571d14",
  },
  {
    pair: "0x00d76633a1071e9aed6158ae1a5e1c4c5dc75e54",
    token0: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    token1: "0xe63d6b308bce0f6193aec6b7e6eba005f41e36ab",
  },
  {
    pair: "0x00d81f53505e1b9486aff9ec916a419786a29057",
    token0: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    token1: "0xd4ac7c0b272d60d821949355f1d933dd3a054751",
  },
];

export function getRandomPool(): Pool {
  return pools[randint() % pools.length];
}

// https://github.com/ethers-io/ethers.js/blob/master/packages/address/src.ts/index.ts#L143

import { V2_FACTORY_ADDRESS, V2_INIT_CODE_HASH } from "../constants";
import { SHA3_Query } from "../w3";

export function pairAddress(tokenAddressA: string, tokenAddressB: string): string {
  const tokenA: string = tokenAddressA.startsWith("0x")
    ? tokenAddressA.substring(2)
    : tokenAddressA;
  const tokenB: string = tokenAddressB.startsWith("0x")
    ? tokenAddressB.substring(2)
    : tokenAddressB;
  let token0: string;
  let token1: string;
  if (tokenA.localeCompare(tokenB) < 0) {
    token0 = tokenA;
    token1 = tokenB;
  } else {
    token0 = tokenB;
    token1 = tokenA;
  }

  const salt: string = SHA3_Query.hex_keccak_256({
    message: token0 + token1,
  }).unwrap();
  const concatenatedItems: Uint8Array = concat([
    "0xff",
    getChecksumAddress(V2_FACTORY_ADDRESS),
    salt,
    V2_INIT_CODE_HASH,
  ]);
  const concatenationHash: string = SHA3_Query.buffer_keccak_256({
    message: concatenatedItems.buffer,
  }).unwrap();
  return getChecksumAddress(concatenationHash.substring(24));
}

export function getChecksumAddress(address: string): string {
  if (address.startsWith("0x")) {
    address = address.substring(2);
  }
  address = address.toLowerCase();
  const chars: string[] = address.split("");

  const expanded: Uint8Array = new Uint8Array(40);
  for (let i = 0; i < 40; i++) {
    expanded[i] = chars[i].charCodeAt(0);
  }

  const hashed: string = SHA3_Query.buffer_keccak_256({
    message: expanded.buffer,
  }).unwrap();
  const hashedArr: Uint8Array = arrayify(hashed);

  for (let i = 0; i < 40; i += 2) {
    if (hashedArr[i >> 1] >> 4 >= 8) {
      chars[i] = chars[i].toUpperCase();
    }
    if ((hashedArr[i >> 1] & 0x0f) >= 8) {
      chars[i + 1] = chars[i + 1].toUpperCase();
    }
  }
  return "0x" + chars.join("");
}

// https://github.com/ethers-io/ethers.js/blob/d395d16fa357ec5dda9b59922cf21c39dc34c071/packages/bytes/lib.esm/index.js#L43
function arrayify(hex: string): Uint8Array {
  if (hex.startsWith("0x")) {
    hex = hex.substring(2);
  }
  const result: Uint8Array = new Uint8Array(hex.length / 2);
  let j: i32 = 0;
  for (let i = 0; i < hex.length; i += 2) {
    result[j++] = U8.parseInt(hex.substring(i, i + 2), 16);
  }
  return result;
}

// https://github.com/ethers-io/ethers.js/blob/d395d16fa357ec5dda9b59922cf21c39dc34c071/packages/bytes/lib.esm/index.js#L89
export function concat(items: string[]): Uint8Array {
  const objects: Uint8Array[] = items.map<Uint8Array>((item: string) => arrayify(item));
  const length = objects.reduce((accum: i32, item: Uint8Array) => accum + item.length, 0);
  const result = new Uint8Array(length);
  let offset: i32 = 0;
  for (let i = 0; i < objects.length; i++) {
    result.set(objects[i], offset);
    offset += objects[i].length;
  }
  return result;
}

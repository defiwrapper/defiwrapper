export function Uint8ArrayFromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${hex}`);
  }

  const hexPayload =
    hex.length >= 2 && hex.charAt(0) == "0" && hex.charAt(1) == "x"
      ? hex.substring(2, hex.length)
      : hex;
  const output = new Uint8Array(hexPayload.length);
  for (let i = 0; i < hexPayload.length; i += 2) {
    output[i / 2] = I8.parseInt(hexPayload.substring(i, i + 2), 16);
  }
  return output;
}

export function Uint8ArrayToUtfStr(array: Uint8Array): string {
  // let out, i, c;
  // let char2, char3;

  let c: i32;
  let char2: i32;
  let char3: i32;

  const len = array.length;
  let out = "";
  let i: i32 = 0;

  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
        );
        break;
    }
  }

  return out;
}

export function hexToUtfStr(hex: string): string {
  return Uint8ArrayToUtfStr(Uint8ArrayFromHex(hex));
}

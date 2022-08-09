export function Uint8ArrayFromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${hex}`);
  }

  let hexPayload =
    hex.length >= 2 && hex.charAt(0) == "0" && hex.charAt(1) == "x"
      ? hex.substring(2, hex.length)
      : hex;

  let trailingZeros = 0;
  for (let i = hexPayload.length - 1; i >= 0; i--) {
    if (hexPayload[i] != "0") break;
    trailingZeros++;
  }

  const trimmedLen = hexPayload.length - trailingZeros;

  hexPayload =
    trimmedLen & 1 ? hexPayload.substring(0, trimmedLen + 1) : hexPayload.substring(0, trimmedLen);

  const buffer = new Uint8Array(hexPayload.length / 2);
  for (let i = 0; i < hexPayload.length; i += 2) {
    buffer[i / 2] = I8.parseInt(hexPayload.substring(i, i + 2), 16);
  }

  return buffer;
}

export function hexToUtfStr(hex: string): string {
  return String.UTF8.decode(Uint8ArrayFromHex(hex).buffer);
}

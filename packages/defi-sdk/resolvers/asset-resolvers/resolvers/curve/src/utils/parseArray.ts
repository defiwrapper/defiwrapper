import { BigNumber } from "@polywrap/wasm-as";

export function parseStringArray(value: string): Array<string> {
  const valueArr: Array<string> = value.trim().split(",");
  for (let i = 0; i < valueArr.length; i++) {
    valueArr[i] = valueArr[i].trim();
  }
  return valueArr;
}

export function parseBigArray(value: string): Array<BigNumber> {
  const valueArr: Array<string> = value
    .trim()
    .substring(1, value.length - 2)
    .split(",");
  const resultArr: Array<BigNumber> = new Array<BigNumber>(valueArr.length);
  for (let i = 0; i < valueArr.length; i++) {
    resultArr[i] = BigNumber.from(valueArr[i].trim());
  }
  return resultArr;
}

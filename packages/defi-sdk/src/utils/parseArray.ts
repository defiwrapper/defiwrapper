import { Big } from "as-big/Big";

export function parseStringArray(value: string): Array<string> {
  const valueArr: Array<string> = value.trim().split(",");
  for (let i = 0; i < valueArr.length; i++) {
    valueArr[i] = valueArr[i].trim();
  }
  return valueArr;
}

export function parseBigArray(value: string): Array<Big> {
  const valueArr: Array<string> = value
    .trim()
    .substr(1, value.length - 2)
    .split(",");
  const resultArr: Array<Big> = new Array<Big>(valueArr.length);
  for (let i = 0; i < valueArr.length; i++) {
    resultArr[i] = Big.of(valueArr[i].trim());
  }
  return resultArr;
}

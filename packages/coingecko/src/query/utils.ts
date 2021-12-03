import { JSON, Nullable } from "@web3api/wasm-as";
import { BigInt } from "as-bigint";
import { TimestampMarketCapPair, TimestampPricePair, TimestampVolumePair } from "./w3";

export function boolToString(bool: Nullable<boolean>): string {
  return bool.isNull || bool.value === false ? "false" : "true";
}

export function getIntegerProperty<T>(json: JSON.Obj, prop: string): T {
  return (json.getInteger(prop) as JSON.Integer).valueOf() as T;
}

export function getNullableIntegerProperty<T>(json: JSON.Obj, prop: string): Nullable<T> {
  if (!json.has(prop) || (json.get(prop) as JSON.Value).isNull) {
    return Nullable.fromNull<T>();
  }

  return Nullable.fromValue((json.getInteger(prop) as JSON.Integer).valueOf() as T);
}

export function getStringProperty(json: JSON.Obj, prop: string): string {
  return (json.get(prop) as JSON.Value).toString();
}

export function getNullableStringProperty(json: JSON.Obj, prop: string): string | null {
  if (!json.has(prop) || (json.get(prop) as JSON.Value).isNull) {
    return null;
  }

  return (json.get(prop) as JSON.Value).toString();
}

export function normalizeTimestampPricePairArray(array: JSON.Arr): TimestampPricePair[] {
  return array._arr.map<TimestampPricePair>((item) => {
    const arrItem = item as JSON.Arr;
    return {
      timestamp: BigInt.fromString(arrItem._arr[0].toString()),
      price: arrItem._arr[1].toString(),
    };
  });
}

export function normalizeTimestampMarketCapPairArray(array: JSON.Arr): TimestampMarketCapPair[] {
  return array._arr.map<TimestampMarketCapPair>((item) => {
    const arrItem = item as JSON.Arr;
    return {
      timestamp: BigInt.fromString(arrItem._arr[0].toString()),
      market_cap: arrItem._arr[1].toString(),
    };
  });
}

export function normalizeTimestampVolumePairArray(array: JSON.Arr): TimestampVolumePair[] {
  return array._arr.map<TimestampVolumePair>((item) => {
    const arrItem = item as JSON.Arr;
    return {
      timestamp: BigInt.fromString(arrItem._arr[0].toString()),
      volume: arrItem._arr[1].toString(),
    };
  });
}

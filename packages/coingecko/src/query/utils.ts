import { JSON, Nullable } from "@web3api/wasm-as";
import { BigInt } from "as-bigint";

import {
  CurrencyMarketCapPair,
  CurrencyPricePair,
  CurrencyVolumePair,
  LocalizedText,
  TimestampMarketCapPair,
  TimestampPricePair,
  TimestampVolumePair,
} from "./w3";

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

  return Nullable.fromValue(getIntegerProperty<T>(json, prop));
}

export function getStringProperty(json: JSON.Obj, prop: string): string {
  return (json.get(prop) as JSON.Value).toString();
}

export function getNullableStringProperty(json: JSON.Obj, prop: string): string | null {
  if (!json.has(prop) || (json.get(prop) as JSON.Value).isNull) {
    return null;
  }

  return getStringProperty(json, prop);
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

export function normalizeLocalizationPairObject(obj: JSON.Obj): LocalizedText[] {
  const result: LocalizedText[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    result.push({ locale: key, text: getStringProperty(obj, key) });
  }

  return result;
}

export function normalizeCurrencyPricePairObject(obj: JSON.Obj): CurrencyPricePair[] {
  const result: CurrencyPricePair[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    result.push({ currency: key, price: getStringProperty(obj, key) });
  }

  return result;
}

export function normalizeCurrencyMarketCapPairObject(obj: JSON.Obj): CurrencyMarketCapPair[] {
  const result: CurrencyMarketCapPair[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    result.push({ currency: key, market_cap: getStringProperty(obj, key) });
  }

  return result;
}

export function normalizeCurrencyVolumePairObject(obj: JSON.Obj): CurrencyVolumePair[] {
  const result: CurrencyVolumePair[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    result.push({ currency: key, volume: getStringProperty(obj, key) });
  }

  return result;
}

export function isValidDateString(dateString: string): boolean {
  const dateParts = dateString.split("-");
  if (dateParts.length !== 3) {
    return false;
  }

  const day = I32.parseInt(dateParts[0], 10);
  const month = I32.parseInt(dateParts[1], 10);
  const year = I32.parseInt(dateParts[2], 10);

  // check parts are valid numbers
  if (isNaN(day) || day < 1 || day > 31 || isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
    return false;
  }

  // create date object from input and check parts are correct based on date object
  const yearStr = year.toString().padStart(4, "0");
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");
  const dateStr = `${yearStr}-${monthStr}-${dayStr}T00:00:00Z`;
  const date = Date.fromString(dateStr);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return false;
  }

  return true;
}

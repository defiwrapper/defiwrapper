import { JSON, Nullable } from "@web3api/wasm-as";

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

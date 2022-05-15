import { JSON, Nullable } from "@web3api/wasm-as";

import { getDataFormatType } from "./constants";
import {
  AccountResolver_Event,
  AccountResolver_EventLog,
  AccountResolver_EventParam,
  AccountResolver_Pagination,
  AccountResolver_Transaction,
  AccountResolver_Transfer,
  AccountResolver_TransfersPerTx,
  DataFormat,
  env,
  Http_UrlParam,
  QueryEnv,
} from "./w3";
import { AccountResolver_TransferType } from "./w3/imported/AccountResolver_TransferType";

export function requireEnv(): QueryEnv {
  if (!env) throw new Error("env is not defined");
  return env as QueryEnv;
}

export function buildUrl(arr: Array<string>): string {
  const url = arr.join("/");
  return url.endsWith("/") ? url : url + "/";
}

export function getGlobalUrlParams(
  apiKey: string,
  quoteCurrency: string,
  format: DataFormat,
): Array<Http_UrlParam> {
  const urlParams: Array<Http_UrlParam> = [
    {
      key: "key",
      value: apiKey,
    },
    {
      key: "quote-currency",
      value: quoteCurrency,
    },
    {
      key: "format",
      value: getDataFormatType(format),
    },
  ];

  return urlParams;
}

export function getIntegerProperty<T>(json: JSON.Obj, prop: string): T {
  const val = json.get(prop);
  if (!val || !val.isInteger) {
    throw new Error("Invalid integer property");
  }

  return (val as JSON.Integer).valueOf() as T;
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

export function getObjectProperty(json: JSON.Obj, prop: string): JSON.Obj {
  const val = json.get(prop);
  if (!val || !val.isObj) {
    throw new Error("Invalid object property");
  }
  return val as JSON.Obj;
}

export function getNullableObjectProperty(json: JSON.Obj, prop: string): JSON.Obj | null {
  if (
    !json.has(prop) ||
    (json.get(prop) as JSON.Value).isNull ||
    !(json.get(prop) as JSON.Value).isObj
  ) {
    return null;
  }

  return getObjectProperty(json, prop);
}

export function getBooleanProperty(json: JSON.Obj, prop: string): boolean {
  const val = json.get(prop);
  if (!val || !val.isBool) {
    throw new Error("Invalid boolean property");
  }
  return (val as JSON.Bool).valueOf();
}

export function getNullableBooleanProperty(json: JSON.Obj, prop: string): Nullable<boolean> {
  if (
    !json.has(prop) ||
    (json.get(prop) as JSON.Value).isNull ||
    !(json.get(prop) as JSON.Value).isBool
  ) {
    return Nullable.fromNull<boolean>();
  }

  return Nullable.fromValue(getBooleanProperty(json, prop));
}

export function getArrayProperty(json: JSON.Obj, prop: string): JSON.Arr {
  const val = json.get(prop);
  if (!val || !val.isArr) {
    throw new Error("Invalid array property");
  }
  return val as JSON.Arr;
}

export function getNullableArrayProperty(json: JSON.Obj, prop: string): JSON.Arr | null {
  if (
    !json.has(prop) ||
    (json.get(prop) as JSON.Value).isNull ||
    !(json.get(prop) as JSON.Value).isArr
  ) {
    return null;
  }

  return getArrayProperty(json, prop);
}

export function parseJsonPagination(
  jsonPagination: JSON.Obj | null,
): AccountResolver_Pagination | null {
  return jsonPagination
    ? {
        total: getNullableIntegerProperty<i32>(jsonPagination as JSON.Obj, "total_count"),
        perPage: getNullableIntegerProperty<i32>(jsonPagination as JSON.Obj, "page_size"),
        page: getNullableIntegerProperty<i32>(jsonPagination as JSON.Obj, "page_number"),
        hasMore: getNullableBooleanProperty(jsonPagination as JSON.Obj, "has_more"),
      }
    : null;
}

export function parseJsonEventParam(jsonParam: JSON.Value): AccountResolver_EventParam {
  if (!jsonParam.isObj) {
    throw new Error("Invalid event param");
  }

  const jsonParamObj = jsonParam as JSON.Obj;

  return {
    name: getStringProperty(jsonParamObj, "name"),
    m_type: getStringProperty(jsonParamObj, "type"),
    indexed: getBooleanProperty(jsonParamObj, "indexed"),
    decoded: getBooleanProperty(jsonParamObj, "decoded"),
    value: getStringProperty(jsonParamObj, "value"),
  };
}

export function parseJsonEventParams(jsonEventParams: JSON.Arr): Array<AccountResolver_EventParam> {
  return jsonEventParams
    ? jsonEventParams
        .valueOf()
        .map<AccountResolver_EventParam>((value: JSON.Value) => parseJsonEventParam(value))
    : [];
}

export function parseJsonEvent(jsonEvent: JSON.Value): AccountResolver_Event {
  if (!jsonEvent.isObj) {
    throw new Error("Invalid event");
  }

  const jsonEventObj = jsonEvent as JSON.Obj;

  return {
    name: getStringProperty(jsonEventObj, "name"),
    signature: getStringProperty(jsonEventObj, "signature"),
    params: parseJsonEventParams(getArrayProperty(jsonEventObj, "params")),
  };
}

export function parseJsonLog(jsonLog: JSON.Value): AccountResolver_EventLog {
  if (!jsonLog.isObj) {
    throw new Error("Invalid log object");
  }

  const log = jsonLog as JSON.Obj;

  return {
    contractAddress: getStringProperty(log, "sender_address"),
    logOffset: getIntegerProperty<i32>(log, "log_offset"),
    topics: getArrayProperty(log, "raw_log_topics")
      .valueOf()
      .map<string>((topic: JSON.Value) => topic.toString()),
    data: getStringProperty(log, "raw_log_data"),
    event: parseJsonEvent(getObjectProperty(log, "decoded")),
  };
}

export function parseJsonLogs(jsonLogs: JSON.Arr | null): AccountResolver_EventLog[] {
  return jsonLogs
    ? jsonLogs.valueOf().map<AccountResolver_EventLog>((value: JSON.Value) => parseJsonLog(value))
    : [];
}

export function parseJsonTxn(jsonTxn: JSON.Value): AccountResolver_Transaction {
  if (!jsonTxn.isObj) {
    throw new Error("Invalid transaction object");
  }

  const jsonTxnObj = jsonTxn as JSON.Obj;

  return {
    hash: getStringProperty(jsonTxnObj, "tx_hash"),
    m_from: getStringProperty(jsonTxnObj, "from_address"),
    to: getStringProperty(jsonTxnObj, "to_address"),
    successful: getBooleanProperty(jsonTxnObj, "successful"),
    value: getStringProperty(jsonTxnObj, "value"),
    quote: getStringProperty(jsonTxnObj, "value_quote"),
    timestamp: getStringProperty(jsonTxnObj, "block_signed_at"),
    blockHeight: getIntegerProperty<i32>(jsonTxnObj, "block_height"),
    offset: getNullableIntegerProperty<i32>(jsonTxnObj, "tx_offset"),
    gasInfo: {
      offered: getStringProperty(jsonTxnObj, "gas_offered"),
      spent: getStringProperty(jsonTxnObj, "gas_spent"),
      price: getStringProperty(jsonTxnObj, "gas_price"),
      quoteRate: getStringProperty(jsonTxnObj, "gas_quote_rate"),
      quote: getStringProperty(jsonTxnObj, "gas_quote"),
    },
    logs: parseJsonLogs(getNullableArrayProperty(jsonTxnObj, "log_events")),
  };
}

export function parseJsonTxns(jsonTxns: JSON.Arr | null): AccountResolver_Transaction[] {
  return jsonTxns
    ? jsonTxns
        .valueOf()
        .map<AccountResolver_Transaction>((value: JSON.Value) => parseJsonTxn(value))
    : [];
}

export function parseTransferType(value: string): AccountResolver_TransferType {
  if (value == "IN") {
    return AccountResolver_TransferType.IN;
  } else if (value == "OUT") {
    return AccountResolver_TransferType.OUT;
  } else {
    throw Error("Unknown transfer type");
  }
}

export function parseJsonTransfer(jsonTransfer: JSON.Value): AccountResolver_Transfer {
  if (!jsonTransfer.isObj) {
    throw new Error("Invalid transfer object");
  }

  const jsonTransferObj = jsonTransfer as JSON.Obj;

  return {
    m_from: getStringProperty(jsonTransferObj, "from_address"),
    to: getStringProperty(jsonTransferObj, "to_address"),
    value: getStringProperty(jsonTransferObj, "delta"),
    quote: getStringProperty(jsonTransferObj, "delta_quote"),
    quoteRate: getStringProperty(jsonTransferObj, "quote_rate"),
    m_type: parseTransferType(getStringProperty(jsonTransferObj, "transfer_type")),
  };
}

export function parseJsonTransfers(jsonTransfers: JSON.Arr | null): AccountResolver_Transfer[] {
  return jsonTransfers
    ? jsonTransfers
        .valueOf()
        .map<AccountResolver_Transfer>((value: JSON.Value) => parseJsonTransfer(value))
    : [];
}

export function parseJsonTransfersPerTxn(jsonTransfer: JSON.Value): AccountResolver_TransfersPerTx {
  if (!jsonTransfer.isObj) {
    throw new Error("Invalid transfer object");
  }

  const jsonTransferObj = jsonTransfer as JSON.Obj;

  return {
    transaction: parseJsonTxn(jsonTransfer),
    transfers: parseJsonTransfers(getNullableArrayProperty(jsonTransferObj, "transfers")),
  };
}

export function parseJsonTransfersPerTxns(
  jsonTransfers: JSON.Arr | null,
): Array<AccountResolver_TransfersPerTx> {
  return jsonTransfers
    ? jsonTransfers
        .valueOf()
        .map<AccountResolver_TransfersPerTx>((value: JSON.Value) => parseJsonTransfersPerTxn(value))
    : [];
}

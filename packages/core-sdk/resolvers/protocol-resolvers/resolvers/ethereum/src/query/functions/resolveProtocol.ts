// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: narrow down on ts-nocheck rules
import { supportedProtocolsMap } from "../supported-protocols-map";
import { Input_resolveProtocol, ProtocolResolver_Protocol } from "../w3";

export function resolveProtocol(input: Input_resolveProtocol): ProtocolResolver_Protocol | null {
  if (input.token.name.startsWith("Curve.fi ") && input.token.name.endsWith(" Gauge Deposit")) {
    return supportedProtocolsMap.get("curve_fi_gauge_v2");
  } else if (input.token.name.startsWith("Curve.fi ")) {
    return supportedProtocolsMap.get("curve_fi_pool_v2");
  } else if (input.token.name.startsWith("yearn ") || input.token.name.startsWith("iearn ")) {
    return supportedProtocolsMap.get("yearn_vault_v1");
  } else if (input.token.name.endsWith(" yVault") || input.token.name.startsWith("yExperimental")) {
    return supportedProtocolsMap.get("yearn_vault_v2");
  } else if (input.token.name.startsWith("Aave Interest bearing ")) {
    return supportedProtocolsMap.get("aave_lending_borrowing_v1");
  } else if (input.token.name.startsWith("Aave interest bearing ")) {
    return supportedProtocolsMap.get("aave_lending_borrowing_v2");
  } else if (input.token.name.startsWith("Aave AMM Market ")) {
    return supportedProtocolsMap.get("aave_lending_borrowing_v2");
  } else if (input.token.symbol == "UNI-V2") {
    return supportedProtocolsMap.get("uniswap_v2");
  } else if (input.token.name == "SushiSwap LP Token") {
    return supportedProtocolsMap.get("sushiswap_v1");
  } else if (input.token.name == "LinkSwap LP Token") {
    return supportedProtocolsMap.get("linkswap_v1");
  } else if (input.token.name.startsWith("Compound ") && input.token.symbol.startsWith("c")) {
    return supportedProtocolsMap.get("compound_v1");
  } else if (input.token.name.startsWith("Cream ") && input.token.symbol.startsWith("cr")) {
    return supportedProtocolsMap.get("cream_v1");
  } else if (input.token.name == "SushiBar") {
    return supportedProtocolsMap.get("sushibar_v1");
  } else if (input.token.name.startsWith("BNT Smart Token")) {
    return supportedProtocolsMap.get("bancor_v2");
  }
  return null;
}

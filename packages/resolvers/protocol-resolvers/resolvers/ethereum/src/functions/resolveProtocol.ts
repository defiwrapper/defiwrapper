// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: narrow down on ts-nocheck rules
import { supportedProtocolsMap } from "../supported-protocols-map";
import { Args_resolveProtocol, ETR_Module, ProtocolResolver_Protocol } from "../wrap";

export function resolveProtocol(args: Args_resolveProtocol): ProtocolResolver_Protocol | null {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    m_type: "ERC20",
  }).unwrap();

  if (token.name.startsWith("Curve.fi ") && token.name.endsWith(" Gauge Deposit")) {
    return supportedProtocolsMap.get("curve_fi_gauge_v2");
  } else if (token.name.startsWith("Curve.fi ")) {
    return supportedProtocolsMap.get("curve_fi_pool_v2");
  } else if (token.name.startsWith("yearn ") || token.name.startsWith("iearn ")) {
    return supportedProtocolsMap.get("yearn_vault_v1");
  } else if (token.name.endsWith(" yVault") || token.name.startsWith("yExperimental")) {
    return supportedProtocolsMap.get("yearn_vault_v2");
  } else if (token.name.startsWith("Aave Interest bearing ")) {
    return supportedProtocolsMap.get("aave_lending_v1");
  } else if (token.name.startsWith("Aave Interest bearing Uni")) {
    return supportedProtocolsMap.get("aave_uniswap_v1");
  } else if (token.name.startsWith("Aave interest bearing ")) {
    return supportedProtocolsMap.get("aave_lending_v2");
  } else if (token.name.startsWith("Aave stable debt bearing")) {
    return supportedProtocolsMap.get("aave_stable_debt_v2");
  } else if (token.name.startsWith("Aave variable debt bearing")) {
    return supportedProtocolsMap.get("aave_variable_debt_v2");
  } else if (token.name.startsWith("Aave AMM Market ")) {
    return supportedProtocolsMap.get("aave_amm_lending_v2");
  } else if (token.name.startsWith("Aave AMM Market stable debt")) {
    return supportedProtocolsMap.get("aave_amm_stable_debt_v2");
  } else if (token.name.startsWith("Aave AMM Market variable debt")) {
    return supportedProtocolsMap.get("aave_amm_variable_debt_v2");
  } else if (token.symbol == "UNI-V2") {
    return supportedProtocolsMap.get("uniswap_v2");
  } else if (token.name == "SushiSwap LP Token") {
    return supportedProtocolsMap.get("sushiswap_v1");
  } else if (token.name == "LinkSwap LP Token") {
    return supportedProtocolsMap.get("linkswap_v1");
  } else if (token.name.startsWith("Compound ") && token.symbol.startsWith("c")) {
    return supportedProtocolsMap.get("compound_v1");
  } else if (token.name.startsWith("Cream ") && token.symbol.startsWith("cr")) {
    return supportedProtocolsMap.get("cream_v1");
  } else if (token.name == "SushiBar") {
    return supportedProtocolsMap.get("sushibar_v1");
  } else if (token.name.startsWith("1inch Liquidity Pool")) {
    return supportedProtocolsMap.get("1inch_v2");
  } else if (token.name.startsWith("Mooniswap V1")) {
    return supportedProtocolsMap.get("1inch_v1");
  } else if (token.name == "Chi Gastoken by 1inch") {
    return supportedProtocolsMap.get("1inch_chi");
  }
  return null;
}

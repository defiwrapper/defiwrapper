import { CURVE_ADDRESS_PROVIDER_ADDRESS, ZERO_ADDRESS } from "../constants";
import { Args_isValidProtocolToken, Ethereum_Module } from "../wrap";

function getLPTokenFromGauge(gaugeTokenAddress: string): string {
  return Ethereum_Module.callContractView({
    address: gaugeTokenAddress,
    method: "function lp_token() view returns (address)",
    args: [],
    connection: null,
  }).unwrap();
}

function isValidCurveFiPool(lpTokenAddress: string): boolean {
  const registeryAddress = Ethereum_Module.callContractView({
    address: CURVE_ADDRESS_PROVIDER_ADDRESS,
    method: "function get_registry() view returns (address)",
    args: [],
    connection: null,
  }).unwrap();

  const poolAddress = Ethereum_Module.callContractView({
    address: registeryAddress,
    method: "function get_pool_from_lp_token(address) view returns (address)",
    args: [lpTokenAddress],
    connection: null,
  }).unwrap();
  return poolAddress !== ZERO_ADDRESS;
}

function isValidCurveFiGauge(gaugeTokenAddress: string): boolean {
  const lpTokenAddress = getLPTokenFromGauge(gaugeTokenAddress);
  return isValidCurveFiPool(lpTokenAddress);
}

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (args.protocolId == "curve_fi_pool_v2") {
    return isValidCurveFiPool(args.tokenAddress);
  } else if (args.protocolId == "curve_fi_gauge_v2") {
    return isValidCurveFiGauge(args.tokenAddress);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}

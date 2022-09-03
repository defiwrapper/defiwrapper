import { CURVE_ADDRESS_PROVIDER_ADDRESS, ZERO_ADDRESS } from "../constants";
import { Args_isValidProtocolToken, Env, Ethereum_Connection, Ethereum_Module } from "../wrap";

function getLPTokenFromGauge(gaugeTokenAddress: string, connection: Ethereum_Connection): string {
  return Ethereum_Module.callContractView({
    address: gaugeTokenAddress,
    method: "function lp_token() view returns (address)",
    args: [],
    connection: connection,
  }).unwrap();
}

function isValidCurveFiPool(lpTokenAddress: string, connection: Ethereum_Connection): boolean {
  const registeryAddress = Ethereum_Module.callContractView({
    address: CURVE_ADDRESS_PROVIDER_ADDRESS,
    method: "function get_registry() view returns (address)",
    args: [],
    connection: connection,
  }).unwrap();

  const poolAddress = Ethereum_Module.callContractView({
    address: registeryAddress,
    method: "function get_pool_from_lp_token(address) view returns (address)",
    args: [lpTokenAddress],
    connection: connection,
  }).unwrap();
  return poolAddress !== ZERO_ADDRESS;
}

function isValidCurveFiGauge(gaugeTokenAddress: string, connection: Ethereum_Connection): boolean {
  const lpTokenAddress = getLPTokenFromGauge(gaugeTokenAddress, connection);
  return isValidCurveFiPool(lpTokenAddress, connection);
}

export function isValidProtocolToken(args: Args_isValidProtocolToken, env: Env): boolean {
  if (args.protocolId == "curve_fi_pool_v2") {
    return isValidCurveFiPool(args.tokenAddress, env.connection);
  } else if (args.protocolId == "curve_fi_gauge_v2") {
    return isValidCurveFiGauge(args.tokenAddress, env.connection);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}

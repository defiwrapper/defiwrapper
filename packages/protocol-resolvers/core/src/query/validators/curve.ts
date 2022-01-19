import { CURVE_ADDRESS_PROVIDER_ADDRESS, ZERO_ADDRESS } from "../constants";
import { env, Ethereum_Query, QueryEnv } from "../w3";

function getLPTokenFromGauge(gaugeTokenAddress: string): string {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;
  const lpTokenAddress = Ethereum_Query.callContractView({
    address: gaugeTokenAddress,
    method: "function lp_token() view returns (address)",
    args: [],
    connection: connection,
  });
  return lpTokenAddress;
}

export function isValidCurveFiPool(lpTokenAddress: string): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;
  const registeryAddress = Ethereum_Query.callContractView({
    address: CURVE_ADDRESS_PROVIDER_ADDRESS,
    method: "function get_registry() view returns (address)",
    args: [],
    connection: connection,
  });

  const poolAddress = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_pool_from_lp_token(address) view returns (address)",
    args: [lpTokenAddress],
    connection: connection,
  });
  return poolAddress !== ZERO_ADDRESS;
}

export function isValidCurveFiGauge(gaugeTokenAddress: string): boolean {
  const lpTokenAddress = getLPTokenFromGauge(gaugeTokenAddress);
  return isValidCurveFiPool(lpTokenAddress);
}

import { CURVE_ADDRESS_PROVIDER_ADDRESS, ZERO_ADDRESS } from "../constants";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function getLPTokenFromGauge(gaugeTokenAddress: string, connection: Ethereum_Connection): string {
  const lpTokenAddress = Ethereum_Query.callContractView({
    address: gaugeTokenAddress,
    method: "function lp_token() view returns (address)",
    args: [],
    connection: connection,
  });
  return lpTokenAddress;
}

function isValidCurveFiPool(lpTokenAddress: string, connection: Ethereum_Connection): boolean {
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

function isValidCurveFiGauge(gaugeTokenAddress: string, connection: Ethereum_Connection): boolean {
  const lpTokenAddress = getLPTokenFromGauge(gaugeTokenAddress, connection);
  return isValidCurveFiPool(lpTokenAddress, connection);
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "curve_fi_pool_v2") {
    return isValidCurveFiPool(input.tokenAddress, connection);
  } else if (input.protocolId == "curve_fi_gauge_v2") {
    return isValidCurveFiGauge(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}

import { isValidCurveFiGauge, isValidCurveFiPool } from "../validators/curve";
import { Input_isValidProtocolToken } from "../w3";

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (input.protocol.id == "curve_fi_gauge_v2") {
    return isValidCurveFiGauge(input.tokenAddress);
  } else if (input.protocol.id == "curve_fi_pool_v2") {
    return isValidCurveFiPool(input.tokenAddress);
  }
  return false;
}

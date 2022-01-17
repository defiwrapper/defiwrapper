import { isValidCurveFiGauge, isValidCurveFiPool } from "../validators/curve";
import { Input_isValidTokenProtocol } from "../w3";

export function isValidTokenProtocol(input: Input_isValidTokenProtocol): boolean {
  if (input.protocolId == "curve_fi_gauge_v2") {
    return isValidCurveFiGauge(input.tokenAddress);
  } else if (input.protocolId == "curve_fi_pool_v2") {
    return isValidCurveFiPool(input.tokenAddress);
  }
  return false;
}

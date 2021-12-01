import { Token } from "../../w3";
import { TokenProtocolType } from "../../w3";

export function getTokenType(token: Token): TokenProtocolType {
  if (token.name.startsWith("Curve ") && token.name.endsWith(" Gauge Deposit")) {
    return TokenProtocolType.CurveGauge;
  } else if (token.name.startsWith("Curve.fi ")) {
    return TokenProtocolType.Curve;
  } else if (token.name.startsWith("Aave Avalanche Market ")) {
    return TokenProtocolType.AaveV2;
  } else if (token.symbol == "UNI-V2") {
    return TokenProtocolType.UniswapV2;
  } else if (token.name == "SushiSwap LP Token") {
    return TokenProtocolType.Sushiswap;
  } else if (token.name == "SushiBar") {
    return TokenProtocolType.Sushibar;
  } else {
    return TokenProtocolType.Native;
  }
}

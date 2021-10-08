import { Token } from "./w3";
import { TokenProtocolType } from "./w3";

export function getTokenType(token: Token): TokenProtocolType {
  if (token.name.startsWith("Curve.fi ") && token.name.endsWith(" Gauge Deposit")) {
    return TokenProtocolType.CurveGauge;
  } else if (token.name.startsWith("Curve.fi ")) {
    return TokenProtocolType.Curve;
  } else if (token.name.startsWith("yearn ") || token.name.startsWith("iearn ")) {
    return TokenProtocolType.YearnV1;
  } else if (token.name.endsWith(" yVault") || token.name.startsWith("yExperimental")) {
    return TokenProtocolType.YearnV2;
  } else if (token.name.startsWith("Aave Interest bearing ")) {
    return TokenProtocolType.AaveV1;
  } else if (token.name.startsWith("Aave interest bearing ")) {
    return TokenProtocolType.AaveV2;
  } else if (token.name.startsWith("Aave AMM Market ")) {
    return TokenProtocolType.AaveAMM;
  } else if (token.symbol == "UNI-V2") {
    return TokenProtocolType.UniswapV2;
  } else if (token.name == "SushiSwap LP Token") {
    return TokenProtocolType.Sushiswap;
  } else if (token.name == "LinkSwap LP Token") {
    return TokenProtocolType.Linkswap;
  } else if (token.name.startsWith("Compound ") && token.symbol.startsWith("c")) {
    return TokenProtocolType.Compound;
  } else if (token.name.startsWith("Cream ") && token.symbol.startsWith("cr")) {
    return TokenProtocolType.Cream;
  } else if (token.name == "SushiBar") {
    return TokenProtocolType.Sushibar;
  } else {
    return TokenProtocolType.Native;
  }
}

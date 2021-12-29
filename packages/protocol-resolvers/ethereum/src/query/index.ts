import { Input_getProtocol, ProtocolResolver_Protocol } from "./w3";

export function getProtocol(input: Input_getProtocol): ProtocolResolver_Protocol {
  if (input.token.name.startsWith("Curve.fi ") && input.token.name.endsWith(" Gauge Deposit")) {
    return {
      name: "Curve gauge",
      version: "1",
    };
  } else if (input.token.name.startsWith("Curve.fi ")) {
    return {
      name: "Curve",
      version: "1",
    };
  } else if (input.token.name.startsWith("yearn ") || input.token.name.startsWith("iearn ")) {
    return {
      name: "Yearn",
      version: "1",
    };
  } else if (input.token.name.endsWith(" yVault") || input.token.name.startsWith("yExperimental")) {
    return {
      name: "Yearn",
      version: "2",
    };
  } else if (input.token.name.startsWith("Aave Interest bearing ")) {
    return {
      name: "Aave",
      version: "1",
    };
  } else if (input.token.name.startsWith("Aave interest bearing ")) {
    return {
      name: "Aave",
      version: "2",
    };
  } else if (input.token.name.startsWith("Aave AMM Market ")) {
    return {
      name: "Aave AMM",
      version: "1",
    };
  } else if (input.token.symbol == "UNI-V2") {
    return {
      name: "Uniswap",
      version: "2",
    };
  } else if (input.token.name == "SushiSwap LP Token") {
    return {
      name: "Sushiswap",
      version: "1",
    };
  } else if (input.token.name == "LinkSwap LP Token") {
    return {
      name: "Linkswap",
      version: "1",
    };
  } else if (input.token.name.startsWith("Compound ") && input.token.symbol.startsWith("c")) {
    return {
      name: "Compound",
      version: "1",
    };
  } else if (input.token.name.startsWith("Cream ") && input.token.symbol.startsWith("cr")) {
    return {
      name: "Cream",
      version: "1",
    };
  } else if (input.token.name == "SushiBar") {
    return {
      name: "Sushibar",
      version: "1",
    };
  } else {
    return {
      name: "Unknown",
      version: "0",
    };
  }
}

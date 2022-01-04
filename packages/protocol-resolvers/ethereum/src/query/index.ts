import { Input_getProtocol, ProtocolResolver_Protocol } from "./w3";

export function getProtocol(input: Input_getProtocol): ProtocolResolver_Protocol {
  if (input.token.name.startsWith("Curve.fi ") && input.token.name.endsWith(" Gauge Deposit")) {
    return {
      organization: "Curve.fi",
      name: "Curve.fi gauge",
      version: "1",
      forkedFrom: null,
    };
  } else if (input.token.name.startsWith("Curve.fi ")) {
    return {
      organization: "Curve.fi",
      name: "Curve.fi pool",
      version: "1",
      forkedFrom: null,
    };
  } else if (input.token.name.startsWith("yearn ") || input.token.name.startsWith("iearn ")) {
    return {
      organization: "Yearn.finance",
      name: "Yearn Vault",
      version: "1",
      forkedFrom: null,
    };
  } else if (input.token.name.endsWith(" yVault") || input.token.name.startsWith("yExperimental")) {
    return {
      organization: "Yearn.finance",
      name: "Yearn Vault",
      version: "2",
      forkedFrom: null,
    };
  } else if (input.token.name.startsWith("Aave Interest bearing ")) {
    return {
      organization: "Aave",
      name: "Aave lending-borrowing",
      version: "1",
      forkedFrom: null,
    };
  } else if (input.token.name.startsWith("Aave interest bearing ")) {
    return {
      organization: "Aave",
      name: "Aave lending-borrowing",
      version: "2",
      forkedFrom: null,
    };
  } else if (input.token.name.startsWith("Aave AMM Market ")) {
    return {
      organization: "Aave",
      name: "Aave AMM pool",
      version: "1",
      forkedFrom: null,
    };
  } else if (input.token.symbol == "UNI-V2") {
    return {
      organization: "Uniswap",
      name: "Uniswap",
      version: "2",
      forkedFrom: null,
    };
  } else if (input.token.name == "SushiSwap LP Token") {
    return {
      organization: "Sushi",
      name: "Sushiswap",
      version: "1",
      forkedFrom: {
        organization: "Uniswap",
        name: "Uniswap",
        version: "2",
        forkedFrom: null,
      },
    };
  } else if (input.token.name == "LinkSwap LP Token") {
    return {
      organization: "Linkswap",
      name: "Linkswap",
      version: "1",
      forkedFrom: {
        organization: "Uniswap",
        name: "Uniswap",
        version: "2",
        forkedFrom: null,
      },
    };
  } else if (input.token.name.startsWith("Compound ") && input.token.symbol.startsWith("c")) {
    return {
      organization: "Compound",
      name: "Compound",
      version: "1",
      forkedFrom: null,
    };
  } else if (input.token.name.startsWith("Cream ") && input.token.symbol.startsWith("cr")) {
    return {
      organization: "Cream",
      name: "Cream",
      version: "1",
      forkedFrom: {
        organization: "Compound",
        name: "Compound",
        version: "1",
        forkedFrom: null,
      },
    };
  } else if (input.token.name == "SushiBar") {
    return {
      organization: "Sushi",
      name: "Sushibar",
      version: "1",
      forkedFrom: null,
    };
  } else {
    return {
      organization: "Unknown",
      name: "Unknown",
      version: null,
      forkedFrom: null,
    };
  }
}

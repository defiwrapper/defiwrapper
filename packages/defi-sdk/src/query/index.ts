import Big from "as-big/Big";

import { getComponents as aaveGetComponents } from "./adapters/aave";
import { getComponents as compoundGetComponents } from "./adapters/compound";
import { getComponents as curveGetComponents } from "./adapters/curve";
import { getComponents as sushibarGetComponents } from "./adapters/sushibar";
import { getComponents as uniswapGetComponents } from "./adapters/uniswap";
import { getComponents as yearnGetComponents } from "./adapters/yearn";
import { getToken } from "./token";
import { getTokenType } from "./tokenTypes";
import {
  Input_getComponents,
  Token,
  TokenComponent,
  TokenComponentsList,
  TokenProtocolType,
} from "./w3";

export function getComponents(input: Input_getComponents): TokenComponentsList {
  const token: Token = getToken(input.address, input.connection);
  const DEFAULT: TokenComponentsList = {
    token: token,
    type: getTokenType(token),
    underlyingTokenComponents: [],
  };
  if (token.address == "Unknown") return DEFAULT;
  if (DEFAULT.type == TokenProtocolType.Native) return DEFAULT;
  let components: Array<TokenComponent> = [
    {
      token: token,
      type: DEFAULT.type,
      rate: "1",
    },
  ];

  while (!components.every((component) => component.type == TokenProtocolType.Native)) {
    const newComponents: Array<TokenComponent> = new Array<TokenComponent>();
    for (let i = 0; i < components.length; i++) {
      let curComponents: Array<TokenComponent> = new Array<TokenComponent>();
      switch (components[i].type) {
        case TokenProtocolType.YearnV1:
          curComponents = yearnGetComponents(components[i].token, "V1", input.connection);
          break;
        case TokenProtocolType.YearnV2:
          curComponents = yearnGetComponents(components[i].token, "V2", input.connection);
          break;
        case TokenProtocolType.Curve:
          curComponents = curveGetComponents(components[i].token, input.connection);
          break;
        case TokenProtocolType.AaveV1:
          curComponents = aaveGetComponents(components[i].token, "V1", input.connection);
          break;
        case TokenProtocolType.AaveV2:
          curComponents = aaveGetComponents(components[i].token, "V2", input.connection);
          break;
        case TokenProtocolType.AaveAMM:
          curComponents = aaveGetComponents(components[i].token, "V2", input.connection);
          break;
        case TokenProtocolType.Compound:
          curComponents = compoundGetComponents(components[i].token, input.connection);
          break;
        case TokenProtocolType.Cream:
          curComponents = compoundGetComponents(components[i].token, input.connection);
          break;
        case TokenProtocolType.UniswapV2:
          curComponents = uniswapGetComponents(components[i].token, input.connection);
          break;
        case TokenProtocolType.Sushiswap:
          curComponents = uniswapGetComponents(components[i].token, input.connection);
          break;
        case TokenProtocolType.Linkswap:
          curComponents = uniswapGetComponents(components[i].token, input.connection);
          break;
        case TokenProtocolType.Sushibar:
          curComponents = sushibarGetComponents(components[i].token, input.connection);
          break;
        default:
          break;
      }
      if (curComponents.length == 0) {
        newComponents.push({
          token: components[i].token,
          rate: components[i].rate,
          type: TokenProtocolType.Native,
        });
      } else {
        for (let j = 0; j < curComponents.length; j++) {
          const curComponentRate: Big = Big.of(curComponents[j].rate);
          const componentRate: Big = Big.of(components[i].rate);
          newComponents.push({
            token: curComponents[j].token,
            rate: curComponentRate.times(componentRate).toString(),
            type: curComponents[j].type,
          });
        }
      }
    }
    components = newComponents;
  }
  if (
    components.length == 1 &&
    components[0].token == token &&
    components[0].type == TokenProtocolType.Native
  ) {
    return DEFAULT;
  }
  return {
    token: token,
    type: DEFAULT.type,
    underlyingTokenComponents: components,
  };
}

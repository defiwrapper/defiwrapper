import { Big } from "as-big/Big";

import { getTokenType } from "../networks/tokenTypes";
import { getToken } from "../token";
import { Ethereum_Connection, Ethereum_Query, Token, TokenComponent } from "../w3";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const componentsList = Ethereum_Query.callContractView({
    address: token.address,
    method: "function getComponents() external view returns(address[] memory)",
    args: [],
    connection: connection,
  });
  if (!componentsList) return [];

  const totalComponentRealUnits = Ethereum_Query.callContractView({
    address: token.address,
    method: "function getTotalComponentRealUnits() external view returns(address[] memory)",
    args: [],
    connection: connection,
  });
  if (!totalComponentRealUnits) return [];

  const components: Array<TokenComponent> = [];
  for (const compAddr of componentsList) {
    const underlyingToken = getToken(compAddr, connection);
    if (underlyingToken.address == "Unknown") return [];
    const underlyingDecimals = Big.of(token.totalSupply.toString());
    const rate = Big.of(totalComponentRealUnits).div(underlyingDecimals);
    const component: TokenComponent = {
      token: underlyingToken,
      type: getTokenType(underlyingToken, connection),
      rate: rate,
    };

    components.push(component);
  }

  return components;
}

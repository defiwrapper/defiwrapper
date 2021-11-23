import { Big } from "as-big/Big";

import { getTokenType } from "../networks/tokenTypes";
import { getToken } from "../token";
import { Ethereum_Connection, Ethereum_Query, Token, TokenComponent } from "../w3";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const SUSHI_ADDRESS = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2";

  const balanceResult = Ethereum_Query.callContractView({
    address: SUSHI_ADDRESS,
    method: "function balanceOf(address) view returns (uint256)",
    args: [token.address],
    connection: connection,
  });
  if (!balanceResult) return [];

  const underlyingToken: Token = getToken(SUSHI_ADDRESS, connection);
  const underlyIngDecimals = Big.of(token.totalSupply.toString());
  const rate = Big.of(balanceResult).div(underlyIngDecimals);

  const components: Array<TokenComponent> = [
    {
      token: underlyingToken,
      type: getTokenType(underlyingToken, connection),
      rate: rate.toString(),
    },
  ];
  return components;
}

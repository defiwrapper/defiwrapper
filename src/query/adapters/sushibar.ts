import { Big } from "as-big/Big";
import { getToken } from "../token";
import { getTokenType } from "../tokenTypes";
import {
  Ethereum_Connection,
  Ethereum_Query,
  Token,
  TokenComponent,
} from "../w3";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection
): Array<TokenComponent> {
  let SUSHI_ADDRESS = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2";

  let balanceResult = Ethereum_Query.callContractView({
    address: SUSHI_ADDRESS,
    method: "function balanceOf(address) view returns (uint256)",
    args: [token.address],
    connection: connection,
  });
  if (!balanceResult) return [];

  let underlyingToken: Token = getToken(SUSHI_ADDRESS, connection);
  let underlyIngDecimals = Big.of(token.totalSupply.toString());
  let rate = Big.of(balanceResult).div(underlyIngDecimals);

  let components: Array<TokenComponent> = [
    {
      token: underlyingToken,
      type: getTokenType(underlyingToken),
      rate: rate.toString(),
    },
  ];
  return components;
}

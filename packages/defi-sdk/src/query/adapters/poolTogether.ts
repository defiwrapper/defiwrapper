import { getTokenType } from "../networks/tokenTypes";
import { getToken } from "../token";
import { Ethereum_Connection, Ethereum_Query, Token, TokenComponent } from "../w3";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const controllerAddress = Ethereum_Query.callContractView({
    address: token.address,
    method: "function controller() view returns (address)",
    args: null,
    connection: connection,
  }).unwrap();

  const underlyingTokenAddress = Ethereum_Query.callContractView({
    address: controllerAddress,
    method: "function token() view returns (address)",
    args: null,
    connection: connection,
  }).unwrap();

  const underlyingToken = getToken(underlyingTokenAddress, connection);

  const components: Array<TokenComponent> = [
    {
      token: underlyingToken,
      m_type: getTokenType(underlyingToken, connection),
      rate: "1",
    },
  ];
  return components;
}

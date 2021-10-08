import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big/Big";

import { getToken } from "../token";
import { getTokenType } from "../tokenTypes";
import { Ethereum_Query, Token, TokenComponent } from "../w3";
import { Ethereum_Connection } from "./../w3/imported/Ethereum_Connection/index";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const tokenResult = new Array<string>(2);
  tokenResult[0] = Ethereum_Query.callContractView({
    address: token.address,
    method: "function token0() view returns (address)",
    args: [],
    connection: connection,
  });
  tokenResult[1] = Ethereum_Query.callContractView({
    address: token.address,
    method: "function token1() view returns (address)",
    args: [],
    connection: connection,
  });
  if (!(tokenResult[0] && tokenResult[1])) return [];

  const tokenDecimals = BigInt.fromString("10").pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()).div(Big.of(tokenDecimals));

  const components = new Array<TokenComponent>(2);

  for (let i = 0; i < 2; i++) {
    const underlyingToken: Token = getToken(tokenResult[i], connection);
    const balanceResult = Ethereum_Query.callContractView({
      address: underlyingToken.address,
      method: "function balanceOf(address) view returns (uint256)",
      args: [token.address],
      connection: connection,
    });
    if (!balanceResult) return [];

    const underlyIngDecimals = BigInt.fromString("10").pow(underlyingToken.decimals).toString();
    const balance: Big = Big.of(balanceResult).div(Big.of(underlyIngDecimals));

    components[i] = {
      token: underlyingToken,
      type: getTokenType(underlyingToken),
      rate: balance.div(totalSupply).toString(),
    };
  }

  return components;
}

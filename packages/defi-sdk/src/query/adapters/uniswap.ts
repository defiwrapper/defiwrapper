import { Big } from "as-big/Big";
import { BigInt } from "@web3api/wasm-as";
import { Ethereum_Connection } from "./../w3/imported/Ethereum_Connection/index";
import { Ethereum_Query, Token, TokenComponent } from "../w3";
import { getToken } from "../token";
import { getTokenType } from "../tokenTypes";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection
): Array<TokenComponent> {
  let tokenResult = new Array<string>(2);
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

  let tokenDecimals = BigInt.fromString("10").pow(token.decimals).toString();
  let totalSupply: Big = Big.of(token.totalSupply.toString()).div(
    Big.of(tokenDecimals)
  );

  let components = new Array<TokenComponent>(2);

  for (let i = 0; i < 2; i++) {
    let underlyingToken: Token = getToken(tokenResult[i], connection);
    let balanceResult = Ethereum_Query.callContractView({
      address: underlyingToken.address,
      method: "function balanceOf(address) view returns (uint256)",
      args: [token.address],
      connection: connection,
    });
    if (!balanceResult) return [];

    let underlyIngDecimals = BigInt.fromString("10")
      .pow(underlyingToken.decimals)
      .toString();
    let balance: Big = Big.of(balanceResult).div(Big.of(underlyIngDecimals));

    components[i] = {
      token: underlyingToken,
      type: getTokenType(underlyingToken),
      rate: balance.div(totalSupply).toString(),
    };
  }

  return components;
}

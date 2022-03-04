import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big/Big";

import { getTokenType } from "../networks/tokenTypes";
import { getToken } from "../token";
import { Ethereum_Connection, Ethereum_Query, Token, TokenComponent } from "../w3";

export function getUnderlyingToken(address: string, connection: Ethereum_Connection): Token {
  const underlyingTokenAddress = Ethereum_Query.callContractView({
    address: address,
    method: "function token() view returns (address)",
    args: null,
    connection: connection,
  }).unwrap();
  if (underlyingTokenAddress) {
    return getToken(underlyingTokenAddress, connection);
  }

  return {
    address: "Unknown",
    name: "Unknown",
    symbol: "Unknown",
    decimals: -1,
    totalSupply: BigInt.fromString("-1"),
  };
}

export function getUnderlyingTokenPercent(
  token: Token,
  version: string,
  connection: Ethereum_Connection,
): string {
  if (version == "V1") {
    const shareResult = Ethereum_Query.callContractView({
      address: token.address,
      method: "function getPricePerFullShare() view returns (uint256)",
      args: null,
      connection: connection,
    });
    const decimals = BigInt.fromString("10").pow(18).toString();
    if (shareResult) {
      return Big.of(shareResult).div(Big.of(decimals)).toString();
    }
  } else {
    const shareResult = Ethereum_Query.callContractView({
      address: token.address,
      method: "function pricePerShare() view returns (uint256)",
      args: null,
      connection: connection,
    });
    const decimals = BigInt.fromString("10").pow(token.decimals).toString();
    if (shareResult) {
      return Big.of(shareResult).div(Big.of(decimals)).toString();
    }
  }
  return "";
}

export function getComponents(
  token: Token,
  version: string,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const underlyingToken: Token = getUnderlyingToken(token.address, connection);
  if (underlyingToken.address == "Unknown") return [];

  const rate: string = getUnderlyingTokenPercent(token, version, connection);
  if (rate == "") return [];

  return [
    {
      token: underlyingToken,
      rate: rate,
      m_type: getTokenType(underlyingToken, connection),
    },
  ];
}

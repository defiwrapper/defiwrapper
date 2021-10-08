import { BigInt } from "@web3api/wasm-as";

import { getToken } from "../token";
import { getTokenType } from "../tokenTypes";
import { Ethereum_Connection, Ethereum_Query, Token, TokenComponent } from "../w3";

export function getUnderlyingToken(
  address: string,
  version: string,
  connection: Ethereum_Connection,
): Token {
  if (version == "V1") {
    const aaveV1Result = Ethereum_Query.callContractView({
      address: address,
      method: "function underlyingAssetAddress() view returns (address)",
      args: null,
      connection: connection,
    });
    if (aaveV1Result) return getToken(aaveV1Result, connection);
  } else {
    const aaveV2Result = Ethereum_Query.callContractView({
      address: address,
      method: "function UNDERLYING_ASSET_ADDRESS() view returns (address)",
      args: null,
      connection: connection,
    });
    if (aaveV2Result) return getToken(aaveV2Result, connection);
  }

  return {
    address: "Unknown",
    name: "Unknown",
    symbol: "Unknown",
    decimals: -1,
    totalSupply: BigInt.fromString("-1"),
  };
}

export function getComponents(
  token: Token,
  version: string,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const underlyingToken: Token = getUnderlyingToken(token.address, version, connection);
  if (underlyingToken.address == "Unknown") return [];
  const components: Array<TokenComponent> = [
    {
      token: underlyingToken,
      type: getTokenType(underlyingToken),
      rate: "1",
    },
  ];
  return components;
}

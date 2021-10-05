import {
  Ethereum_Query,
  Ethereum_Connection,
  Token,
  TokenComponent,
} from "../w3";
import { getToken } from "../token";
import { BigInt } from "@web3api/wasm-as";
import { getTokenType } from "../tokenTypes";

export function getUnderlyingToken(
  address: string,
  version: string,
  connection: Ethereum_Connection
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
  connection: Ethereum_Connection
): Array<TokenComponent> {
  let underlyingToken: Token = getUnderlyingToken(
    token.address,
    version,
    connection
  );
  if (underlyingToken.address == "Unknown") return [];
  let components: Array<TokenComponent> = [
    {
      token: underlyingToken,
      type: getTokenType(underlyingToken),
      rate: "1",
    },
  ];
  return components;
}

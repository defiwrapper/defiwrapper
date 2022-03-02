import { JSON } from "@web3api/wasm-as";

import { Subgraph_Query } from "../w3";

export class SubgraphEndpoint {
  author: string;
  name: string;
}

export enum AaveTokenType {
  a,
  s,
  v,
  _MAX_,
}

export class SubgraphToken {
  id: string;
  underlyingAssetAddress: string;
  underlyingAssetDecimals: i32;
  type: AaveTokenType;
}

export function getSubgraphEndpoint(protocolId: string): SubgraphEndpoint {
  if (protocolId == "aave_lending_borrowing_v2") {
    return { author: "aave", name: "protocol-v2" };
  } else if (protocolId == "aave_amm_pool_v2") {
    return { author: "aave", name: "protocol-v2" };
  } else if (protocolId == "aave_lending_borrowing_v1") {
    return { author: "aave", name: "protocol-multy-raw" };
  } else {
    throw new Error("Unknown protocolId");
  }
}

function aaveTokenTypeToString(type: AaveTokenType): string {
  switch (type) {
    case AaveTokenType.a:
      return "a";
    case AaveTokenType.s:
      return "s";
    case AaveTokenType.v:
      return "v";
    default:
      throw new Error("unknown Aave token type");
  }
}

export function fetchTokenFromSubgraph(
  tokenAddress: string,
  tokenType: AaveTokenType,
  protocolId: string,
): SubgraphToken | null {
  const endpoint: SubgraphEndpoint = getSubgraphEndpoint(protocolId);
  const type: string = aaveTokenTypeToString(tokenType);
  const queryRes = Subgraph_Query.subgraphQuery({
    subgraphAuthor: endpoint.author,
    subgraphName: endpoint.name,
    query: `
      query {
        ${type}token(id:"${tokenAddress}") {
          id
          underlyingAssetAddress
          underlyingAssetDecimals
        }
      }`,
  });
  if (queryRes.isErr) {
    throw new Error(queryRes.unwrapErr());
  }
  const query: JSON.Value = queryRes.unwrap();

  // token was found?
  const dataJson: JSON.Obj | null = (<JSON.Obj>query).getObj("data");
  if (dataJson === null) return null;
  const aTokenJson: JSON.Obj | null = dataJson.getObj("atoken");
  if (aTokenJson == null) return null;

  // parse token
  const jsonId: JSON.Str | null = aTokenJson.getString("id");
  const id: string = jsonId == null ? "" : jsonId.valueOf();
  const jsonAddress: JSON.Str | null = aTokenJson.getString("underlyingAssetAddress");
  const assetAddress: string = jsonAddress == null ? "" : jsonAddress.valueOf();
  const jsonDecimals: JSON.Integer | null = aTokenJson.getInteger("underlyingAssetDecimals");
  const assetDecimals: i32 = jsonDecimals == null ? 0 : <i32>jsonDecimals.valueOf();
  return {
    id: id,
    underlyingAssetAddress: assetAddress,
    underlyingAssetDecimals: assetDecimals,
    type: tokenType,
  };
}

import { V1_LENDING_PROTOCOL_ID, V2_AMM_PROTOCOL_ID, V2_LENDING_PROTOCOL_ID } from "../constants";
import { AaveTokenType, fetchTokenFromSubgraph, SubgraphToken } from "../utils/subgraph";
import { env, Ethereum_Connection, Input_isValidProtocolToken, QueryEnv } from "../w3";

// query Aave subgraph and check if token is a recognized aToken, sToken, or vToken
// export function tokenIsRegistered(tokenAddress: string, protocolId: string): boolean {
//   const endpoint: SubgraphEndpoint = getSubgraphEndpoint(protocolId);
//   const tokenTypes: string[] = ["a", "s", "v"];
//   for (let i = 0; i < tokenTypes.length; i++) {
//     const type: string = tokenTypes[i];
//     const queryRes = Subgraph_Query.subgraphQuery({
//       subgraphAuthor: endpoint.author,
//       subgraphName: endpoint.name,
//       query: `
//       query {
//         ${type}token(id:"${tokenAddress}") {
//           id
//         }
//       }`,
//     });
//     if (queryRes.isErr) {
//       throw new Error(queryRes.unwrapErr());
//     }
//     const query: JSON.Value = queryRes.unwrap();
//     const dataJson: JSON.Obj | null = (<JSON.Obj>query).getObj("data");
//     if (dataJson === null) return false;
//     const aTokenJson: JSON.Obj | null = dataJson.getObj("atoken");
//     if (aTokenJson !== null) return true;
//   }
//   return false;
// }

export function isTokenRegistered(tokenAddress: string, protocolId: string): boolean {
  for (let i = 0; i < AaveTokenType._MAX_; i++) {
    const type: AaveTokenType = <AaveTokenType>i;
    const token: SubgraphToken | null = fetchTokenFromSubgraph(tokenAddress, type, protocolId);
    if (token !== null) {
      return true;
    }
  }
  return false;
}

function isValidAaveLendingPoolV2(tokenAddress: string): boolean {
  return isTokenRegistered(tokenAddress, V2_LENDING_PROTOCOL_ID);
}

function isValidAaveAmmPoolV2(lpTokenAddress: string, connection: Ethereum_Connection): boolean {
  return false;
}

function isValidAaveLendingPoolV1(tokenAddress: string): boolean {
  return isTokenRegistered(tokenAddress, V1_LENDING_PROTOCOL_ID);
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == V2_LENDING_PROTOCOL_ID) {
    return isValidAaveLendingPoolV2(input.tokenAddress);
  } else if (input.protocolId == V2_AMM_PROTOCOL_ID) {
    return isValidAaveAmmPoolV2(input.tokenAddress, connection);
  } else if (input.protocolId == V1_LENDING_PROTOCOL_ID) {
    return isValidAaveLendingPoolV1(input.tokenAddress);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}

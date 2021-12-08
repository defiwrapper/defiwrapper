import { Ethereum_Connection, Ethereum_Query, Token, TokenProtocolType } from "../w3";
import { getTokenType as getAvalancheTokenType } from "./avalanche/tokenTypes";
import { getTokenType as getMainnetTokenType } from "./mainnet/tokenTypes";
import { getTokenType as getPolygonTokenType } from "./polygon/tokenTypes";

export function getTokenType(token: Token, connection: Ethereum_Connection): TokenProtocolType {
  const network = Ethereum_Query.getNetwork({ connection: connection });
  switch (network.chainId) {
    case 1:
      return getMainnetTokenType(token);
    case 137:
      return getPolygonTokenType(token);
    case 43114:
      return getAvalancheTokenType(token);
    default:
      throw new Error("chainId: " + network.chainId.toString() + " isn't currently supported!");
  }
}

import { Ethereum_Connection, Token, TokenProtocolType } from "../w3";
import { getTokenType as getMainnetTokenType } from "./mainnet/tokenTypes";
import { getTokenType as getPolygonTokenType } from "./polygon/tokenTypes";

export function getTokenType(token: Token, connection: Ethereum_Connection): TokenProtocolType {
  // TODO: plugin should have a way to fetch chainID from connection object
  if (connection.networkNameOrChainId == "MAINNET") {
    return getMainnetTokenType(token);
  } else {
    return getPolygonTokenType(token);
  }
}

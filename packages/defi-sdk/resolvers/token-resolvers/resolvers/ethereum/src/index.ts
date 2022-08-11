import { getERC20Token } from "./ERC20";
import { Args_getToken, TokenResolver_Token } from "./wrap";

export function getToken(args: Args_getToken): TokenResolver_Token {

  if (args.m_type == "ERC20") {
    return getERC20Token(args.address);
  } else {
    throw new Error("unsupported token type");
  }
}

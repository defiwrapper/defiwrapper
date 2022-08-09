import { getERC20Token } from "./ERC20";
import { Args_getToken, Env, TokenResolver_Token } from "./wrap";

export function getToken(args: Args_getToken, env: Env | null): TokenResolver_Token {
  if (env == null) throw new Error("env is not set");
  const connection = env.connection;

  if (args.m_type == "ERC20") {
    return getERC20Token(args.address, connection);
  } else {
    throw new Error("unsupported token type");
  }
}

import { getERC20Token } from "./ERC20";
import { env, Input_getToken, QueryEnv, TokenResolver_Token } from "./w3";

export function getToken(input: Input_getToken): TokenResolver_Token {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.m_type == "ERC20") {
    return getERC20Token(input.address, connection);
  } else {
    throw new Error("unsupported token type");
  }
}
